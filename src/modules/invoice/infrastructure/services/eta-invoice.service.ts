import { Inject, Injectable } from '@nestjs/common';

import { google as GoogleProtos } from '@google-cloud/tasks/build/protos/protos';

import { CLOUD_TASKS_PROVIDER, ETA_E_INVOICING_PROVIDER } from '../../../../core/constants';
import { Authority } from '../../../../core/enums';
import { AddEtaInvoice, CloudTasksService, EtaEInvoicingService } from '../../../../core/providers';
import { Utils } from '../../../../core/utils';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CLIENT_SERVICE_PROVIDER, IClientService } from '../../../client/domain';
import { CODE_SERVICE_PROVIDER, ICodeService } from '../../../code/domain';
import {
  BRANCH_SERVICE_PROVIDER,
  IBranchService,
  IOrganizationService,
  IOrganizationTaxService,
  Organization,
  ORGANIZATION_SERVICE_PROVIDER,
  ORGANIZATION_TAX_SERVICE_PROVIDER,
  OrganizationTax,
} from '../../../organization/domain';
import {
  ETA_EINVOICING_QUEUE_PROVIDER,
  IEtaInvoiceService,
  IInvoiceItemRepository,
  IInvoiceRepository,
  IInvoiceSubmissionRepository,
  INVOICE_ITEM_REPOSITORY_PROVIDER,
  INVOICE_REPOSITORY_PROVIDER,
  INVOICE_SUBMISSION_REPOSITORY_PROVIDER,
  TaxInvoice,
  TaxInvoiceStatus,
} from '../../domain';

@Injectable()
export class EtaInvoiceService implements IEtaInvoiceService {
  constructor(
    @Inject(CLOUD_TASKS_PROVIDER)
    private readonly cloudTasksService: CloudTasksService,

    @InjectQueue(ETA_EINVOICING_QUEUE_PROVIDER)
    private readonly etaInvoiceQueue: Queue,

    @Inject(INVOICE_REPOSITORY_PROVIDER)
    private readonly invoiceRepo: IInvoiceRepository<TaxInvoice>,

    @Inject(INVOICE_ITEM_REPOSITORY_PROVIDER)
    private readonly itemRepo: IInvoiceItemRepository,

    @Inject(INVOICE_SUBMISSION_REPOSITORY_PROVIDER)
    private readonly submissionRepo: IInvoiceSubmissionRepository,

    @Inject(ETA_E_INVOICING_PROVIDER)
    private readonly etaEInvoicing: EtaEInvoicingService,

    @Inject(CODE_SERVICE_PROVIDER)
    private readonly codeService: ICodeService,

    @Inject(ORGANIZATION_SERVICE_PROVIDER)
    private readonly organizationService: IOrganizationService,

    @Inject(BRANCH_SERVICE_PROVIDER)
    private readonly branchService: IBranchService,

    @Inject(ORGANIZATION_TAX_SERVICE_PROVIDER)
    private readonly organizationTaxService: IOrganizationTaxService,

    @Inject(CLIENT_SERVICE_PROVIDER)
    private readonly clientService: IClientService,
  ) {}

  async processInvoices(ids: string[]): Promise<boolean> {
    // Fetch invoices and their associated items in bulk
    const invoices: TaxInvoice[] = await Promise.all(
      ids.map(async id => {
        const invoice = await this.invoiceRepo.get(id);
        invoice.items = await this.itemRepo.getMany(invoice.id);
        return invoice;
      }),
    );

    const organizationId: string = invoices[0].organizationId;
    const organization: Organization = await this.organizationService.getOrganization(organizationId);
    const organizationTax: OrganizationTax = await this.organizationTaxService.getTax(organizationId);

    // Extract unique client IDs and fetch clients and their taxes
    const uniqueClientIds = Array.from(new Set(invoices.map(invoice => invoice.clientId)));
    //TODO: REVIEW THIS AFTER DELETE CLIENT TAXES
    const clients = await Promise.all(uniqueClientIds.map(async clientId => this.clientService.getClient(clientId)));
    const clientMap = new Map(clients.map(client => [client.id, { client }]));

    // TODO: TEST THE QUERY WITH ARRAY-CONTAINS, AND REVISE FIRESTORE TO_FIRESTORE CONVERTER
    const allCodeIds = invoices.flatMap(invoice => invoice.items.map(item => item.codeId));
    const uniqueCodeIds = Array.from(new Set(allCodeIds));
    const codes = await this.codeService.getCodes(organizationId, [{ key: 'id', operator: 'arco', value: uniqueCodeIds }]);

    const promises = invoices.map(async invoice => {
      const branch = await this.branchService.getBranch(invoice.branchId);
      const { client } = clientMap.get(invoice.clientId) || {};

      // Initiate processing the invoice
      await this.invoiceRepo.update({ id: invoice.id, taxStatus: TaxInvoiceStatus.PROCESSING });

      const payload = JSON.stringify({
        invoiceId: invoice.id,
        organizationId: invoice.organizationId,
        taxId: organizationTax.taxIdNo,
        etaDocument: Utils.Object.dropUndefined(Utils.Eta.mapInvoiceToEtaInvoice(invoice, client, organization, organizationTax, branch, codes)),
        action: 'SentToSign',
      });

      const task: GoogleProtos.cloud.tasks.v2.ITask = {
        name: this.cloudTasksService.getTaskName(invoice.organizationId, invoice.id),
        httpRequest: {
          body: Buffer.from(payload).toString('base64'),
          headers: { 'Content-Type': 'application/json' },
          httpMethod: 'POST',
          url: 'https://us-east1-mofawtar-backend.cloudfunctions.net/publishEinvoiceToSign',
        },
      };

      return await this.cloudTasksService.addTask(invoice.organizationId, task);
    });

    return await Promise.all(promises)
      .then(() => true)
      .catch(() => false);
  }

  async submitInvoices(invoices: (AddEtaInvoice & { invoiceId: string })[], organizationId: string): Promise<void> {
    // Define failure reasons
    const failureReasons = ['No slots found', 'Certificate not found', 'no device detected'];

    const failedInvoices = invoices.filter(invoice => failureReasons.includes(invoice?.signatures[0]?.value));
    const succeededInvoices = invoices.filter(invoice => !failureReasons.includes(invoice?.signatures[0]?.value));

    if (failedInvoices.length) {
      const updatedInvoices: (Partial<TaxInvoice> & { id: string })[] = failedInvoices.map(invoice => {
        return {
          id: invoice.invoiceId,
          taxStatus: TaxInvoiceStatus.FAILED,
          reason: invoice?.signatures[0]?.value,
        };
      });

      await this.invoiceRepo.updateMany(updatedInvoices);
    }

    if (failedInvoices.length == invoices.length) {
      // ! All invoices failed
      return;
    }

    // Prepare documents to submit
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const documents: AddEtaInvoice[] = succeededInvoices.map(({ invoiceId, ...rest }) => rest);

    // Get organization credentials and submit invoices
    const authority = Authority.ETA;
    const organizationTax: OrganizationTax = await this.organizationTaxService.getTax(organizationId);
    const { eInvoiceCredentials } = organizationTax;

    const { submissionId, rejectedDocuments, acceptedDocuments } = await this.etaEInvoicing.addInvoices(
      documents,
      { clientId: eInvoiceCredentials.clientId, clientSecret: eInvoiceCredentials.clientSecret },
      organizationId,
    );

    const submissions = [];
    const updateInvoices = [];
    const invoiceQueues = [];

    // Append accepted submissions to the list
    for (const document of acceptedDocuments) {
      const invoice = invoices.find(invoice => invoice.internalID === document.internalId);
      const { invoiceId, signatures } = invoice;
      const signature = signatures[0]?.value;

      submissions.push({ invoiceId, organizationId, authority, submissionId, signature, status: 'accepted', data: { ...document } });
      updateInvoices.push({ id: invoiceId, uuid: document.uuid, taxStatus: TaxInvoiceStatus.SUBMITTED });

      // Add successful submitted invoice to queue
      invoiceQueues.push({
        uuid: document.uuid,
        invoiceId,
        credential: { clientId: eInvoiceCredentials.clientId, clientSecret: eInvoiceCredentials.clientSecret },
      });
    }

    // Append rejected submissions to the list
    for (const document of rejectedDocuments) {
      const invoice = invoices.find(invoice => invoice.internalID === document.internalId);
      const { invoiceId, signatures } = invoice;
      const signature = signatures[0]?.value;
      const rejectionReason = document.error.details.map(detail => `${document.error.message} - ${detail.message}: ${detail.target}`).join(', ');

      submissions.push({ invoiceId, organizationId, authority, submissionId, signature, status: 'rejected', data: { ...document }, rejectionReason });
      updateInvoices.push({ id: invoiceId, taxStatus: TaxInvoiceStatus.REJECTED, reason: rejectionReason });
    }

    // Add submissions & update invoices
    for (const submission of submissions) {
      await this.submissionRepo.add(submission, submission.invoiceId);
    }

    await this.invoiceRepo.updateMany(updateInvoices);

    // Apply ETA invoice queue
    for (const invoiceQueue of invoiceQueues) {
      const { uuid, invoiceId, credential } = invoiceQueue;
      await this.etaInvoiceQueue.add(
        'refresh-eta-data',
        {
          uuid: uuid,
          organizationId,
          invoiceId,
          credential,
        },
        {
          attempts: 7,
          removeOnComplete: true,
          removeOnFail: true,
          backoff: 60000,
        },
      );
    }
  }

  async cancelInvoice(id: string, uuid: string, status: 'cancelled' | 'rejected', reason: string): Promise<TaxInvoice> {
    const invoice = await this.invoiceRepo.get(id);
    const organizationTax: OrganizationTax = await this.organizationTaxService.getTax(invoice.organizationId);
    const credential = { clientId: organizationTax.eInvoiceCredentials.clientId, clientSecret: organizationTax.eInvoiceCredentials.clientSecret };

    return this.etaEInvoicing.rejectOrCancelInvoice(uuid, status, reason, credential, invoice.organizationId).then(async response => {
      if (response) {
        const taxStatus = status === 'rejected' ? TaxInvoiceStatus.REJECTED : TaxInvoiceStatus.CANCELLED;
        return this.etaEInvoicing.getInvoice(uuid, credential, invoice.organizationId).then(async details => {
          console.log('🚀 ~ EtaInvoiceService ~ getInvoice ~ details:', details);
          return this.invoiceRepo.update({
            id,
            taxStatus,
            // TODO: FILL THE DETAILS DATA NEEDED INTO THE INVOICE OBJECT
          });
        });
      }
    });
  }

  async acceptInvoice(id: string): Promise<TaxInvoice> {
    return this.invoiceRepo.update({ id, taxStatus: TaxInvoiceStatus.ACCEPTED });
  }
}
