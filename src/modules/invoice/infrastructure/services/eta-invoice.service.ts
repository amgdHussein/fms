import { Inject, Injectable } from '@nestjs/common';

import { google as GoogleProtos } from '@google-cloud/tasks/build/protos/protos';

import { AUTH_PROVIDER, CLOUD_TASKS_PROVIDER, ETA_E_INVOICING_PROVIDER } from '../../../../core/constants';
import { Authority, CurrencyCode } from '../../../../core/enums';
import { AddEtaInvoice, CloudTasksService, EtaEInvoicingService, InvoiceQueryResult } from '../../../../core/providers';
import { Utils } from '../../../../core/utils';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DateTime } from 'luxon';
import { AuthService } from '../../../../core/auth';
import { BadRequestException } from '../../../../core/exceptions';
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
  InvoiceDirection,
  InvoiceForm,
  InvoiceStatus,
  InvoiceType,
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

    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,
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
    const clients = await Promise.all(uniqueClientIds.map(async clientId => this.clientService.getClient(clientId)));
    const clientMap = new Map(clients.map(client => [client.id, { client }]));

    // TODO: TEST THE QUERY WITH ARRAY-CONTAINS, AND REVISE FIRESTORE TO_FIRESTORE CONVERTER
    const allCodeIds = invoices.flatMap(invoice => invoice.items.map(item => item.codeId));
    const uniqueCodeIds = Array.from(new Set(allCodeIds));
    // const codes = await this.codeService.getCodes(organizationId, [{ key: 'id', operator: 'arco', value: uniqueCodeIds }]); //TODO: NOT WORKING
    const allCodes = await this.codeService.getCodes(organizationId);
    const codes = allCodes.filter(code => uniqueCodeIds.includes(code.id));

    const promises = invoices.map(async invoice => {
      const branch = await this.branchService.getBranch(invoice.branchId);
      const { client } = clientMap.get(invoice.clientId) || {};

      // Initiate processing the invoice
      await this.invoiceRepo.update({ id: invoice.id, taxStatus: TaxInvoiceStatus.PROCESSING });

      const payload = JSON.stringify({
        invoiceId: invoice.id,
        organizationId: invoice.organizationId,
        taxId: organizationTax.taxIdNo,
        userId: this.authService.currentUser.uid, // 'HzaLsCcLdCevrJ9ARpNMpEWlWzZ2', //TODO: Make sure that user uid is exist in dev mode
        etaDocument: Utils.Object.dropUndefined(Utils.Eta.mapInvoiceToEtaInvoice(invoice, client, organization, organizationTax, branch, codes)),
        action: 'SentToSign',
      });

      const task: GoogleProtos.cloud.tasks.v2.ITask = {
        name: this.cloudTasksService.getTaskName(invoice.organizationId, invoice.id),
        httpRequest: {
          body: Buffer.from(payload).toString('base64'),
          headers: { 'Content-Type': 'application/json' },
          httpMethod: 'POST',
          // url: 'https://us-east1-mofawtar-backend.cloudfunctions.net/publishEinvoiceToSign', //PROD  //TODO: MAKE THIS DYNAMIC BASED ON ENV
          url: 'https://publisheinvoicetosign-884544377423.us-east1.run.app', // DEV
        },
      };

      return await this.cloudTasksService.addTask(invoice.organizationId, task);
    });

    return await Promise.all(promises) // TODO: I DON'T WANT TO FAIL WHEN ANY FAIL, EVERY INVOICE SHOULD BE PROCESSED INDEPENDENTLY AND UPDATE IT'S STATUS IF ANY ERROR
      .then(() => true)
      .catch((err: any) => {
        console.log('err', err);

        return false;
      });
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
          updatedBy: this.authService.currentUser.uid,
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

  // async syncReceivedInvoices(organizationId: string): Promise<any> {
  //   //Check if the org have already any received invoice
  //   // if true then load previous 30 day
  //   // else load from the start of the year

  //   // const allOrganizationInvoices = await this.invoiceRepo.getMany([{ key: 'organizationId', operator: 'eq', value: organizationId }]);

  //   // const allReceivedInvoices = allOrganizationInvoices.filter(invoice => invoice.direction === InvoiceDirection.RECEIVED);

  //   // // check if the organization have any received invoices
  //   // const isAnyReceivedInvoice = allOrganizationInvoices.some(invoice => invoice.direction === InvoiceDirection.RECEIVED);

  //   // if (isAnyReceivedInvoice) {
  //   //   this.syncAllReceivedInvoicesFromStartOfTheMonth(organizationId, allReceivedInvoices);
  //   // } else {
  //   // this.syncAllReceivedInvoicesFromStartOfTheYear(organizationId);
  //   // }
  // }

  async syncAllReceivedInvoicesFromStartOfTheMonth(organizationId: string, allReceivedInvoicesFromDB: TaxInvoice[]): Promise<any> {
    // get all recieved invoices from eta
    // check for duplicate invoices
    // save unique them in firestore
    // update the invoice status
    // return true;

    const organization = await this.organizationService.getOrganization(organizationId);
    const organizationTax = await this.organizationTaxService.getTax(organizationId);

    const pageSize = 700; // !note that max page size is 900 as eta employee told me
    let continuationToken = '';
    const allReceivedInvoices: InvoiceQueryResult[] = [];

    do {
      const response = await this.etaEInvoicing.queryDocuments(
        {
          pageSize: pageSize,
          issueDateFrom: DateTime.now().minus({ days: 30 }).toISO(), // DateTime.local(2024, 9, 1).startOf('month').toISO(), // '2024-09-01T15:00:59',
          issueDateTo: DateTime.now().toISO(),
          direction: 'Received',
          continuationToken: continuationToken,
        },
        organizationTax.eInvoiceCredentials,
        organizationId,
      );

      continuationToken = response.metadata.continuationToken;

      allReceivedInvoices.push(...response.result);
    } while (continuationToken !== 'EndofResultSet');

    // loop over all received invoices to get their details

    const newInvoices: TaxInvoice[] = [];

    //TODO: THINK OF THIS QUERY
    const oldInvoicesFromDB = allReceivedInvoicesFromDB.filter(invoice => invoice.taxStatus === TaxInvoiceStatus.ACCEPTED);

    console.log('allReceivedInvoices', allReceivedInvoices.length, allReceivedInvoices);

    for (const receivedInvoice of allReceivedInvoices) {
      //console.log('🚀 ~ InvoiceService ~ syncReceivedEtaInvoice ~ inv:', receivedInvoice);
      const findInvoiceByUuid = oldInvoicesFromDB.find(oldInv => oldInv.uuid === receivedInvoice.uuid);

      if (!findInvoiceByUuid) {
        const etaInvoiceDetails = await this.etaEInvoicing.getInvoice(receivedInvoice.uuid, organizationTax.eInvoiceCredentials, organizationId);

        //TODO: THINK OF THIS CONDITIONS
        const isForeignInvoice = etaInvoiceDetails.currenciesSold === 'Foreign' && organization.currency !== etaInvoiceDetails.currencySegments[0]?.currency;
        // const rate = etaInvoiceDetails.currencySegments[0]?.currencyExchangeRate ?? 1;

        //TODO: WHICH TO FILL receivedInvoice OR etaInvoiceDetails
        const body: Partial<TaxInvoice> = {
          organizationId: organizationId,
          clientId: organizationId, //TODO: THINK OF IT WITH CLIENT DATA

          // branchId: //TODO: HOW TO GET BRANCH ID

          issuer: {
            name: etaInvoiceDetails.issuer.name,
            taxId: etaInvoiceDetails.issuer.id,
            address: {
              street: etaInvoiceDetails.issuer.address.street,
              city: etaInvoiceDetails.issuer.address.regionCity,
              country: etaInvoiceDetails.issuer.address.country,
              governorate: etaInvoiceDetails.issuer.address.governate,
              postalCode: etaInvoiceDetails.issuer.address.postalCode,
            },
          },

          receiver: {
            name: etaInvoiceDetails.receiver.name,
            taxId: etaInvoiceDetails.receiver.id,
            type: etaInvoiceDetails.receiver.type, //TODO: THIS WILL COME IN NUMBER. YOU SHOULD MAP IT TO ENUM
            address: {
              street: etaInvoiceDetails.receiver.address.street,
              city: etaInvoiceDetails.receiver.address.regionCity,
              country: etaInvoiceDetails.receiver.address.country,
              governorate: etaInvoiceDetails.receiver.address.governate,
              postalCode: etaInvoiceDetails.receiver.address.postalCode,
            },
          },

          invoiceNumber: receivedInvoice.internalId,

          type: InvoiceType.TAX,
          form: etaInvoiceDetails.documentType as InvoiceForm,
          direction: InvoiceDirection.RECEIVED,

          currency: {
            code: etaInvoiceDetails.currencySegments[0]?.currency as CurrencyCode,
            rate: etaInvoiceDetails.currencySegments[0]?.currencyExchangeRate ?? 1,
          },
          status: InvoiceStatus.SENT,

          discount: isForeignInvoice ? etaInvoiceDetails.currencySegments[0].totalDiscount : receivedInvoice.totalDiscount,
          additionalDiscount: isForeignInvoice ? etaInvoiceDetails.currencySegments[0].extraDiscountAmount : etaInvoiceDetails?.extraDiscountAmount,
          tax: 0,

          grossAmount: isForeignInvoice ? etaInvoiceDetails.currencySegments[0].totalSales : receivedInvoice.totalSales,
          netAmount: isForeignInvoice ? etaInvoiceDetails.currencySegments[0].netAmount : receivedInvoice.netAmount,
          paidAmount: 0,
          totalAmount: isForeignInvoice ? etaInvoiceDetails.currencySegments[0].totalAmount : receivedInvoice.totalAmount,

          //TODO: HOW TO ADD ITEMS
          // items: etaInvoiceDetails.invoiceLines.map(line => {
          //   return {
          //     organizationId: organizationId,

          //     invoiceId: '',
          //     codeId: '',

          //     name: line?.itemPrimaryName,
          //     description: line?.description,
          //     nameAr: line?.itemSecondaryName,
          //     descriptionAr: line?.itemSecondaryDescription,
          //     category: '',

          //     unitPrice: isForeignInvoice ? line?.unitValue.amountSold : line?.unitValue.amountEGP,
          //     unitType: line.unitType,
          //     quantity: line?.quantity,
          //     discount: {
          //       type: 'fixed',
          //       value: isForeignInvoice ? line?.discountForeign.amountForeign : line?.discountForeign.amount,
          //     },

          //     grossAmount: isForeignInvoice ? line?.salesTotalForeign : line?.salesTotal,
          //     netAmount: isForeignInvoice ? line?.netTotalForeign : line?.netTotal,
          //     totalAmount: isForeignInvoice ? line?.totalForeign : line?.total,

          //     wightType: line?.weightUnitType,
          //     wight: line?.weightQuantity,

          //     taxes: line.lineTaxableItems.map(tax => {
          //       return {
          //         taxType: tax.taxType,
          //         subType: tax.subType,
          //         type: 'fixed',
          //         amount: isForeignInvoice ? tax.amountForeign : tax.amount,
          //       };
          //     }),
          //     taxDiscount: {
          //       type: 'fixed',
          //       value: isForeignInvoice ? line.itemsDiscountForeign : line.itemsDiscount,
          //     },
          //     profitOrLoss: isForeignInvoice ? line.valueDifferenceForeign : line?.valueDifference,
          //   };
          // }),

          // references: etaInvoiceDetails.references?.join(', '), //TODO: !! THIS REFERENCE FROM ETA IS UUID IN ETA NOT THE SAME AS OUR REFERENCE

          issuedAt: DateTime.fromISO(receivedInvoice.dateTimeIssued).toMillis(),
          dueAt: DateTime.fromISO(receivedInvoice.dateTimeIssued).toMillis(),

          authority: Authority.ETA,
          uuid: receivedInvoice.uuid,
          taxStatus: TaxInvoiceStatus.SUBMITTED, //TODO: THINK OF THIS

          url: receivedInvoice.publicUrl,
          activityCode: etaInvoiceDetails.taxpayerActivityCode,

          deliveryAt: DateTime.fromISO(etaInvoiceDetails.serviceDeliveryDate).toMillis(),
          uuidReferences: etaInvoiceDetails.references?.join(', '),
          // submissionUUID: receivedInvoice.submissionUUID,
        };

        //TODO: ADD IN BULK BUT THINK IF ANY ERROR EXIST ?
        const newBulk = await this.invoiceRepo.add(body); // TODO: ITEMS WILL NOT BE SAVED CORRECTLY
        newInvoices.push(newBulk);
        return;
      } else {
        // update any status or cancel or reject
        // await this.updateInvoice({
        //   ...body.invoice,
        //   taxData: {
        //     ...body.invoice.taxData,
        //     taxStatus: 'refused',
        //     fullData: etaInvoiceDetails,
        //   },
        // });
        // await this.updateInvoice({
        //   ...invoice,
        //   status: Status.PAID,
        //   recordPayment: {
        //     amount: totalAmount,
        //     type: 'cash',
        //     paidOn: Date.now(),
        //   },
        // });
        // await this.updateInvoice({
        //   ...body.invoice,
        //   taxData: {
        //     ...body.invoice.taxData,
        //     fullData: etaInvoiceDetails,
        //   },
        // });
        // await this.updateInvoice({
        //   ...findInvoiceByUuid,
        //   taxData: {
        //     ...findInvoiceByUuid.taxData,
        //     taxStatus:
        //       etaInvoiceDetails.status === DocumentFullStatus.SUBMITTED
        //         ? 'pending'
        //         : etaInvoiceDetails.status === DocumentFullStatus.VALID
        //         ? 'accepted'
        //         : [DocumentFullStatus.INVALID, DocumentFullStatus.REJECTED].includes(etaInvoiceDetails.status)
        //         ? 'refused'
        //         : etaInvoiceDetails.status === DocumentFullStatus.CANCELLED
        //         ? 'cancelled'
        //         : 'failed',
        //     fullData: etaInvoiceDetails,
        //   },
        // });
      }
    }

    return newInvoices;
  }

  // async syncAllReceivedInvoicesFromStartOfTheYear(organizationId: string): Promise<true> {
  async syncReceivedInvoices(organizationId: string): Promise<true> {
    // get all received invoices from eta
    // check for duplicate invoices
    // save unique them in firestore
    // update the invoice status
    // return true;

    const organization = await this.organizationService.getOrganization(organizationId);
    const organizationTax = await this.organizationTaxService.getTax(organizationId);

    if (!organizationTax.configurationFlags.activeInvoice) {
      throw new BadRequestException('ETA is not active for this organization');
    }

    // Get the current date
    const currentDate = DateTime.now();
    const currentYear = currentDate.year;

    const pageSize = 700; // !note that max page size is 900 as eta employee told me
    let continuationToken = '';
    const etaReceivedInvoices: InvoiceQueryResult[] = [];

    // Loop through months from January to the current month
    for (let month = 1; month <= currentDate.month; month++) {
      // Create a DateTime for the start of the month
      const startOfMonth = DateTime.local(currentYear, month).startOf('month');
      const endOfMonth = startOfMonth.endOf('month');

      do {
        const response = await this.etaEInvoicing.queryDocuments(
          {
            pageSize: pageSize,
            issueDateFrom: startOfMonth.toISO(),
            issueDateTo: endOfMonth.toISO(),
            direction: 'Received',
            continuationToken: continuationToken,
          },
          organizationTax.eInvoiceCredentials,
          organizationId,
        );

        continuationToken = response.metadata.continuationToken;

        etaReceivedInvoices.push(...response.result);
      } while (continuationToken !== 'EndofResultSet');
    }

    // loop over all received invoices to get their details
    const newInvoices: TaxInvoice[] = [];

    const allOrganizationInvoices = await this.invoiceRepo.getMany([{ key: 'organizationId', operator: 'eq', value: organizationId }]);

    const oldInvoicesFromDB = allOrganizationInvoices.filter(
      invoice => invoice.direction === InvoiceDirection.RECEIVED && invoice.taxStatus === TaxInvoiceStatus.ACCEPTED,
    );

    for (const receivedInvoice of etaReceivedInvoices) {
      const findInvoiceByUuid = oldInvoicesFromDB.find(oldInv => oldInv.uuid === receivedInvoice.uuid);

      if (!findInvoiceByUuid) {
        const etaInvoiceDetails = await this.etaEInvoicing.getInvoice(receivedInvoice.uuid, organizationTax.eInvoiceCredentials, organizationId);

        //TODO: THINK OF THIS CONDITIONS
        const isForeignInvoice = etaInvoiceDetails.currenciesSold === 'Foreign' && organization.currency !== etaInvoiceDetails.currencySegments[0]?.currency;
        // const rate = etaInvoiceDetails.currencySegments[0]?.currencyExchangeRate ?? 1;

        //TODO: WHICH TO FILL receivedInvoice OR etaInvoiceDetails
        const body: Partial<TaxInvoice> = {
          organizationId: organizationId,
          clientId: organizationId, //TODO: THINK OF IT WITH CLIENT DATA

          // branchId: //TODO: HOW TO GET BRANCH ID

          issuer: {
            name: etaInvoiceDetails.issuer.name,
            taxId: etaInvoiceDetails.issuer.id,
            address: {
              street: etaInvoiceDetails.issuer.address.street,
              city: etaInvoiceDetails.issuer.address.regionCity,
              country: etaInvoiceDetails.issuer.address.country,
              governorate: etaInvoiceDetails.issuer.address.governate,
              postalCode: etaInvoiceDetails.issuer.address.postalCode,
            },
          },

          receiver: {
            name: etaInvoiceDetails.receiver.name,
            taxId: etaInvoiceDetails.receiver.id,
            type: etaInvoiceDetails.receiver.type, //TODO: THIS WILL COME IN NUMBER. YOU SHOULD MAP IT TO ENUM
            address: {
              street: etaInvoiceDetails.receiver.address.street,
              city: etaInvoiceDetails.receiver.address.regionCity,
              country: etaInvoiceDetails.receiver.address.country,
              governorate: etaInvoiceDetails.receiver.address.governate,
              postalCode: etaInvoiceDetails.receiver.address.postalCode,
            },
          },

          invoiceNumber: receivedInvoice.internalId,

          type: InvoiceType.TAX,
          form: etaInvoiceDetails.documentType as InvoiceForm,
          direction: InvoiceDirection.RECEIVED,

          currency: {
            code: etaInvoiceDetails.currencySegments[0]?.currency as CurrencyCode,
            rate: etaInvoiceDetails.currencySegments[0]?.currencyExchangeRate ?? 1,
          },
          status: InvoiceStatus.SENT,

          discount: isForeignInvoice ? etaInvoiceDetails.currencySegments[0].totalDiscount : receivedInvoice.totalDiscount,
          additionalDiscount: isForeignInvoice ? etaInvoiceDetails.currencySegments[0].extraDiscountAmount : etaInvoiceDetails?.extraDiscountAmount,
          tax: 0,

          grossAmount: isForeignInvoice ? etaInvoiceDetails.currencySegments[0].totalSales : receivedInvoice.totalSales,
          netAmount: isForeignInvoice ? etaInvoiceDetails.currencySegments[0].netAmount : receivedInvoice.netAmount,
          paidAmount: 0,
          totalAmount: isForeignInvoice ? etaInvoiceDetails.currencySegments[0].totalAmount : receivedInvoice.totalAmount,

          //TODO: HOW TO ADD ITEMS
          // items: etaInvoiceDetails.invoiceLines.map(line => {
          //   return {
          //     organizationId: organizationId,

          //     invoiceId: '',
          //     codeId: '',

          //     name: line?.itemPrimaryName,
          //     description: line?.description,
          //     nameAr: line?.itemSecondaryName,
          //     descriptionAr: line?.itemSecondaryDescription,
          //     category: '',

          //     unitPrice: isForeignInvoice ? line?.unitValue.amountSold : line?.unitValue.amountEGP,
          //     unitType: line.unitType,
          //     quantity: line?.quantity,
          //     discount: {
          //       type: 'fixed',
          //       value: isForeignInvoice ? line?.discountForeign.amountForeign : line?.discountForeign.amount,
          //     },

          //     grossAmount: isForeignInvoice ? line?.salesTotalForeign : line?.salesTotal,
          //     netAmount: isForeignInvoice ? line?.netTotalForeign : line?.netTotal,
          //     totalAmount: isForeignInvoice ? line?.totalForeign : line?.total,

          //     wightType: line?.weightUnitType,
          //     wight: line?.weightQuantity,

          //     taxes: line.lineTaxableItems.map(tax => {
          //       return {
          //         taxType: tax.taxType,
          //         subType: tax.subType,
          //         type: 'fixed',
          //         amount: isForeignInvoice ? tax.amountForeign : tax.amount,
          //       };
          //     }),
          //     taxDiscount: {
          //       type: 'fixed',
          //       value: isForeignInvoice ? line.itemsDiscountForeign : line.itemsDiscount,
          //     },
          //     profitOrLoss: isForeignInvoice ? line.valueDifferenceForeign : line?.valueDifference,
          //   };
          // }),

          // references: etaInvoiceDetails.references?.join(', '), //TODO: !! THIS REFERENCE FROM ETA IS UUID IN ETA NOT THE SAME AS OUR REFERENCE

          issuedAt: DateTime.fromISO(receivedInvoice.dateTimeIssued).toMillis(),
          dueAt: DateTime.fromISO(receivedInvoice.dateTimeIssued).toMillis(),

          authority: Authority.ETA,
          uuid: receivedInvoice.uuid,
          taxStatus: TaxInvoiceStatus.SUBMITTED, //TODO: THINK OF THIS

          url: receivedInvoice.publicUrl,
          activityCode: etaInvoiceDetails.taxpayerActivityCode,

          deliveryAt: DateTime.fromISO(etaInvoiceDetails.serviceDeliveryDate).toMillis(),
          uuidReferences: etaInvoiceDetails.references?.join(', '),
          // submissionUUID: receivedInvoice.submissionUUID,
        };

        //TODO: ADD IN BULK BUT THINK IF ANY ERROR EXIST ?
        const newBulk = await this.invoiceRepo.add(body); // TODO: ITEMS WILL NOT BE SAVED CORRECTLY
        newInvoices.push(newBulk);
        return;
      } else {
        // update any status or cancel or reject
        // await this.updateInvoice({
        //   ...body.invoice,
        //   taxData: {
        //     ...body.invoice.taxData,
        //     taxStatus: 'refused',
        //     fullData: etaInvoiceDetails,
        //   },
        // });
        // await this.updateInvoice({
        //   ...invoice,
        //   status: Status.PAID,
        //   recordPayment: {
        //     amount: totalAmount,
        //     type: 'cash',
        //     paidOn: Date.now(),
        //   },
        // });
        // await this.updateInvoice({
        //   ...body.invoice,
        //   taxData: {
        //     ...body.invoice.taxData,
        //     fullData: etaInvoiceDetails,
        //   },
        // });
        // await this.updateInvoice({
        //   ...findInvoiceByUuid,
        //   taxData: {
        //     ...findInvoiceByUuid.taxData,
        //     taxStatus:
        //       etaInvoiceDetails.status === DocumentFullStatus.SUBMITTED
        //         ? 'pending'
        //         : etaInvoiceDetails.status === DocumentFullStatus.VALID
        //         ? 'accepted'
        //         : [DocumentFullStatus.INVALID, DocumentFullStatus.REJECTED].includes(etaInvoiceDetails.status)
        //         ? 'refused'
        //         : etaInvoiceDetails.status === DocumentFullStatus.CANCELLED
        //         ? 'cancelled'
        //         : 'failed',
        //     fullData: etaInvoiceDetails,
        //   },
        // });
      }
    }

    return true;
  }

  // //TODO: TEST THE BELOW FUNCTION WELL IN ORDER TO USE AS DAILY CRON TASK
  // async syncAllOrgsReceivedEtaInvoice(): Promise<true> {
  //   console.log('syncAllOrgsReceivedEtaInvoice');

  //   // let org: Organization;

  //   // get all recieved invoices from eta
  //   // check for duplicate invoices
  //   // save unique them in firestore
  //   // update the invoice status
  //   // return true;

  //   const allOrgs = await this.organizationService.getOrganizations(1, 5000);

  //   const orgsWithEta = allOrgs.data.filter(org => org.taxDetails.isEtaActive);

  //   for (const orgNew of orgsWithEta) {
  //     const credentials: EtaCredentials = {
  //       etaActiveEnvironment: true,
  //       clientId: orgNew.taxDetails.etaSettings.production.clientId,
  //       clientSecret: orgNew.taxDetails.etaSettings.production.clientSecret,
  //       systemId: orgNew.systemId,
  //     };

  //     // console.log('credentials', credentials);

  //     // Get the current date
  //     const currentDate = DateTime.now();
  //     const currentYear = currentDate.year;

  //     const pageSize = 700; // !note that max page size is 900 as eta employee told me
  //     let continuationToken = null;
  //     // let pageNumber = 1;
  //     // let totalPages = 0;
  //     const allReceivedInvoices: DocumentSummaryFull[] = [];

  //     // Loop through months from January to the current month
  //     for (let month = 1; month <= currentDate.month; month++) {
  //       // Create a DateTime for the start of the month
  //       const startOfMonth = DateTime.local(currentYear, month).startOf('month');
  //       const endOfMonth = startOfMonth.endOf('month');

  //       // console.log(`Processing month: ${startOfMonth.toFormat('MMMM yyyy')}`);
  //       // console.log(`Start of month: ${startOfMonth.toISO()}`);
  //       // console.log(`End of month: ${endOfMonth.toISO()}`);

  //       // Perform your custom logic here

  //       do {
  //         const response = await this.etaEInvoicingService.searchDocuments(
  //           {
  //             pageSize: pageSize,
  //             issueDateFrom: startOfMonth.toISO(),
  //             issueDateTo: endOfMonth.toISO(),
  //             direction: DocumentDirection.RECEIVED,
  //             continuationToken: continuationToken,
  //           },
  //           credentials,
  //         );

  //         continuationToken = response.metadata.continuationToken;

  //         allReceivedInvoices.push(...response.result);
  //       } while (continuationToken !== 'EndofResultSet');
  //     }

  //     // invoice?.taxData?.uuid

  //     console.log('systemId ', orgNew.systemId);

  //     //TODO: THINK OF THIS QUERY
  //     const oldInvoicesFromDB = (
  //       await this.getInvoices(1, 5000, [
  //         {
  //           key: 'taxData.submissionStatus',
  //           operator: 'eq',
  //           value: 'Accepted',
  //         },
  //         {
  //           key: 'taxData.fullData.status',
  //           operator: 'eq',
  //           value: 'Valid',
  //         },
  //       ])
  //     ).data;

  //     console.log('allReceivedInvoices', allReceivedInvoices.length, allReceivedInvoices);

  //     for (const receivedInvoice of allReceivedInvoices) {
  //       //console.log('🚀 ~ InvoiceService ~ syncReceivedEtaInvoice ~ inv:', receivedInvoice);
  //       const findInvoiceByUuid = oldInvoicesFromDB.find(oldInv => oldInv.taxData.uuid === receivedInvoice.uuid);
  //       const etaInvoiceDetails = await this.etaEInvoicingService.getDocumentDetails(receivedInvoice.uuid, credentials);

  //       if (!findInvoiceByUuid) {
  //         const body: EInvoice = {
  //           id: '',
  //           invoiceNumber: receivedInvoice.internalId,
  //           references: etaInvoiceDetails.references?.join(', '),
  //           systemId: orgNew.systemId, //TODO: HOW TO GET SYSTEM ID FROM ETA think when use cron job
  //           clientId: '0', //TODO: THINK OF IT WITH CLIENT DATA
  //           clientData: {
  //             displayName: etaInvoiceDetails.receiver.name,
  //             taxInfo: {
  //               id: etaInvoiceDetails.receiver.id,
  //             },
  //           },
  //           issueDate: DateTime.fromISO(receivedInvoice.dateTimeIssued).toMillis(),
  //           dueDate: DateTime.fromISO(receivedInvoice.dateTimeIssued).toMillis(),
  //           address: {
  //             street1: etaInvoiceDetails.receiver.address.street,
  //             city: etaInvoiceDetails.receiver.address.regionCity,
  //             country: etaInvoiceDetails.receiver.address.country,
  //             stateOrProvince: etaInvoiceDetails.receiver.address.governate,
  //             postalCode: etaInvoiceDetails.receiver.address.postalCode,
  //           },
  //           organization: {
  //             name: etaInvoiceDetails.issuer.name,
  //             taxId: etaInvoiceDetails.issuer.id,
  //             branch: {
  //               id: Utils.Generate.complexNumericId(),
  //               isPrimary: false,
  //               name: 'no-name',
  //               branchId: etaInvoiceDetails.issuer.address.branchID,
  //               street: etaInvoiceDetails.issuer.address.street,
  //               city: etaInvoiceDetails.issuer.address.regionCity,
  //               country: etaInvoiceDetails.issuer.address.country,
  //               governate: etaInvoiceDetails.issuer.address.governate,
  //               buildingNumber: etaInvoiceDetails.issuer.address.buildingNumber,
  //               postalCode: etaInvoiceDetails.issuer.address.postalCode,
  //               floor: etaInvoiceDetails.issuer.address.floor,
  //               room: etaInvoiceDetails.issuer.address.room,
  //               landmark: etaInvoiceDetails.issuer.address.landmark,
  //               additionalInformation: etaInvoiceDetails.issuer.address.additionalInformation,
  //             },
  //             // address: {
  //             //   street1: etaInvoiceDetails.issuer.address.street,
  //             //   city: etaInvoiceDetails.issuer.address.regionCity,
  //             //   country: etaInvoiceDetails.issuer.address.country,
  //             //   stateOrProvince: etaInvoiceDetails.issuer.address.governate,
  //             //   postalCode: etaInvoiceDetails.issuer.address.postalCode,
  //             // },
  //           },
  //           amount: receivedInvoice.totalSales,
  //           netAmount: receivedInvoice.netAmount,
  //           totalAmount: receivedInvoice.total,
  //           totalAmountPaid: 0,
  //           discountsTotal: receivedInvoice.totalDiscount,
  //           extraDiscountAmount: etaInvoiceDetails?.extraDiscountAmount,
  //           isProductionMode: receivedInvoice.publicUrl.includes('preprod') ? false : true,

  //           invoiceLines: etaInvoiceDetails.invoiceLines.map(line => {
  //             return {
  //               id: '0',
  //               lineData: null,
  //               name: line?.itemPrimaryName,
  //               description: line?.description,
  //               quantity: line?.quantity,
  //               price: line?.unitValue.amountEGP,
  //               amount: line?.salesTotal,
  //               netTotal: line?.netTotal,
  //               totalAmount: line?.total,
  //               discount: line?.discount,
  //               discountAmount: line?.discount?.amount,
  //               itemsDiscount: line?.itemsDiscount,
  //               valueDifference: line?.valueDifference,
  //               weightUnitType: line?.weightUnitType,
  //               weightQuantity: line?.weightQuantity,
  //               lineTaxableItems: line?.lineTaxableItems,
  //             };
  //           }),
  //           currency: {
  //             code: etaInvoiceDetails.currencySegments[0]?.currency, // [this.defaultOrg?.preferences?.primaryCurrency || 'EGP'],
  //             exchangeRate: etaInvoiceDetails.currencySegments[0]?.currencyExchangeRate,
  //           },
  //           status: Status.SENT,
  //           category: 'Eta',
  //           type: etaInvoiceDetails.documentType.toUpperCase() as InvoiceType,
  //           taxData: {
  //             taxpayerActivityCode: etaInvoiceDetails.taxpayerActivityCode,

  //             publicUrl: receivedInvoice.publicUrl,
  //             uuid: receivedInvoice.uuid,
  //             submissionUUID: receivedInvoice.submissionUUID,
  //             fullData: etaInvoiceDetails,
  //             taxStatus: 'ready',
  //             submissionStatus: 'Accepted',
  //             documentDirection: DocumentDirection.RECEIVED,
  //           },
  //           metadata: {
  //             etaInvoice: etaInvoiceDetails,
  //           },
  //         };

  //         //TODO: ADD IN BULK BUT THINK IF ANY ERROR EXIST ?
  //         await this.addInvoice(body);
  //         //console.log('newInvoices 0', newInvoices);
  //       } else {
  //         // update any status or cancel or reject
  //         await this.updateInvoice({
  //           ...findInvoiceByUuid,
  //           taxData: {
  //             ...findInvoiceByUuid.taxData,
  //             taxStatus:
  //               etaInvoiceDetails.status === DocumentFullStatus.SUBMITTED
  //                 ? 'pending'
  //                 : etaInvoiceDetails.status === DocumentFullStatus.VALID
  //                   ? 'accepted'
  //                   : [DocumentFullStatus.INVALID, DocumentFullStatus.REJECTED].includes(etaInvoiceDetails.status)
  //                     ? 'refused'
  //                     : etaInvoiceDetails.status === DocumentFullStatus.CANCELLED
  //                       ? 'cancelled'
  //                       : 'failed',
  //             fullData: etaInvoiceDetails,
  //           },
  //         });
  //       }
  //     }
  //   }

  //   return true;
  // }

  async syncAllReceivedInvoices(): Promise<true> {
    console.log('syncAllOrgsReceivedEtaInvoice');

    // let org: Organization;

    // get all recieved invoices from eta
    // check for duplicate invoices
    // save unique them in firestore
    // update the invoice status
    // return true;

    const allOrgs = await this.organizationService.getOrganizations();

    // const orgsWithEta = allOrgs.data.filter(org => org.taxDetails.isEtaActive);

    // for (const orgNew of orgsWithEta) {
    //   const credentials: EtaCredentials = {
    //     etaActiveEnvironment: true,
    //     clientId: orgNew.taxDetails.etaSettings.production.clientId,
    //     clientSecret: orgNew.taxDetails.etaSettings.production.clientSecret,
    //     systemId: orgNew.systemId,
    //   };

    //   // console.log('credentials', credentials);

    //   // Get the current date
    //   const currentDate = DateTime.now();
    //   const currentYear = currentDate.year;

    //   const pageSize = 700; // !note that max page size is 900 as eta employee told me
    //   let continuationToken = null;
    //   // let pageNumber = 1;
    //   // let totalPages = 0;
    //   const allReceivedInvoices: DocumentSummaryFull[] = [];

    //   // Loop through months from January to the current month
    //   for (let month = 1; month <= currentDate.month; month++) {
    //     // Create a DateTime for the start of the month
    //     const startOfMonth = DateTime.local(currentYear, month).startOf('month');
    //     const endOfMonth = startOfMonth.endOf('month');

    //     // console.log(`Processing month: ${startOfMonth.toFormat('MMMM yyyy')}`);
    //     // console.log(`Start of month: ${startOfMonth.toISO()}`);
    //     // console.log(`End of month: ${endOfMonth.toISO()}`);

    //     // Perform your custom logic here

    //     do {
    //       const response = await this.etaEInvoicingService.searchDocuments(
    //         {
    //           pageSize: pageSize,
    //           issueDateFrom: startOfMonth.toISO(),
    //           issueDateTo: endOfMonth.toISO(),
    //           direction: DocumentDirection.RECEIVED,
    //           continuationToken: continuationToken,
    //         },
    //         credentials,
    //       );

    //       continuationToken = response.metadata.continuationToken;

    //       allReceivedInvoices.push(...response.result);
    //     } while (continuationToken !== 'EndofResultSet');
    //   }

    //   // invoice?.taxData?.uuid

    //   console.log('systemId ', orgNew.systemId);

    //   //TODO: THINK OF THIS QUERY
    //   const oldInvoicesFromDB = (
    //     await this.getInvoices(1, 5000, [
    //       {
    //         key: 'taxData.submissionStatus',
    //         operator: 'eq',
    //         value: 'Accepted',
    //       },
    //       {
    //         key: 'taxData.fullData.status',
    //         operator: 'eq',
    //         value: 'Valid',
    //       },
    //     ])
    //   ).data;

    //   console.log('allReceivedInvoices', allReceivedInvoices.length, allReceivedInvoices);

    //   for (const receivedInvoice of allReceivedInvoices) {
    //     //console.log('🚀 ~ InvoiceService ~ syncReceivedEtaInvoice ~ inv:', receivedInvoice);
    //     const findInvoiceByUuid = oldInvoicesFromDB.find(oldInv => oldInv.taxData.uuid === receivedInvoice.uuid);
    //     const etaInvoiceDetails = await this.etaEInvoicingService.getDocumentDetails(receivedInvoice.uuid, credentials);

    //     if (!findInvoiceByUuid) {
    //       const body: EInvoice = {
    //         id: '',
    //         invoiceNumber: receivedInvoice.internalId,
    //         references: etaInvoiceDetails.references?.join(', '),
    //         systemId: orgNew.systemId, //TODO: HOW TO GET SYSTEM ID FROM ETA think when use cron job
    //         clientId: '0', //TODO: THINK OF IT WITH CLIENT DATA
    //         clientData: {
    //           displayName: etaInvoiceDetails.receiver.name,
    //           taxInfo: {
    //             id: etaInvoiceDetails.receiver.id,
    //           },
    //         },
    //         issueDate: DateTime.fromISO(receivedInvoice.dateTimeIssued).toMillis(),
    //         dueDate: DateTime.fromISO(receivedInvoice.dateTimeIssued).toMillis(),
    //         address: {
    //           street1: etaInvoiceDetails.receiver.address.street,
    //           city: etaInvoiceDetails.receiver.address.regionCity,
    //           country: etaInvoiceDetails.receiver.address.country,
    //           stateOrProvince: etaInvoiceDetails.receiver.address.governate,
    //           postalCode: etaInvoiceDetails.receiver.address.postalCode,
    //         },
    //         organization: {
    //           name: etaInvoiceDetails.issuer.name,
    //           taxId: etaInvoiceDetails.issuer.id,
    //           branch: {
    //             id: Utils.Generate.complexNumericId(),
    //             isPrimary: false,
    //             name: 'no-name',
    //             branchId: etaInvoiceDetails.issuer.address.branchID,
    //             street: etaInvoiceDetails.issuer.address.street,
    //             city: etaInvoiceDetails.issuer.address.regionCity,
    //             country: etaInvoiceDetails.issuer.address.country,
    //             governate: etaInvoiceDetails.issuer.address.governate,
    //             buildingNumber: etaInvoiceDetails.issuer.address.buildingNumber,
    //             postalCode: etaInvoiceDetails.issuer.address.postalCode,
    //             floor: etaInvoiceDetails.issuer.address.floor,
    //             room: etaInvoiceDetails.issuer.address.room,
    //             landmark: etaInvoiceDetails.issuer.address.landmark,
    //             additionalInformation: etaInvoiceDetails.issuer.address.additionalInformation,
    //           },
    //           // address: {
    //           //   street1: etaInvoiceDetails.issuer.address.street,
    //           //   city: etaInvoiceDetails.issuer.address.regionCity,
    //           //   country: etaInvoiceDetails.issuer.address.country,
    //           //   stateOrProvince: etaInvoiceDetails.issuer.address.governate,
    //           //   postalCode: etaInvoiceDetails.issuer.address.postalCode,
    //           // },
    //         },
    //         amount: receivedInvoice.totalSales,
    //         netAmount: receivedInvoice.netAmount,
    //         totalAmount: receivedInvoice.total,
    //         totalAmountPaid: 0,
    //         discountsTotal: receivedInvoice.totalDiscount,
    //         extraDiscountAmount: etaInvoiceDetails?.extraDiscountAmount,
    //         isProductionMode: receivedInvoice.publicUrl.includes('preprod') ? false : true,

    //         invoiceLines: etaInvoiceDetails.invoiceLines.map(line => {
    //           return {
    //             id: '0',
    //             lineData: null,
    //             name: line?.itemPrimaryName,
    //             description: line?.description,
    //             quantity: line?.quantity,
    //             price: line?.unitValue.amountEGP,
    //             amount: line?.salesTotal,
    //             netTotal: line?.netTotal,
    //             totalAmount: line?.total,
    //             discount: line?.discount,
    //             discountAmount: line?.discount?.amount,
    //             itemsDiscount: line?.itemsDiscount,
    //             valueDifference: line?.valueDifference,
    //             weightUnitType: line?.weightUnitType,
    //             weightQuantity: line?.weightQuantity,
    //             lineTaxableItems: line?.lineTaxableItems,
    //           };
    //         }),
    //         currency: {
    //           code: etaInvoiceDetails.currencySegments[0]?.currency, // [this.defaultOrg?.preferences?.primaryCurrency || 'EGP'],
    //           exchangeRate: etaInvoiceDetails.currencySegments[0]?.currencyExchangeRate,
    //         },
    //         status: Status.SENT,
    //         category: 'Eta',
    //         type: etaInvoiceDetails.documentType.toUpperCase() as InvoiceType,
    //         taxData: {
    //           taxpayerActivityCode: etaInvoiceDetails.taxpayerActivityCode,

    //           publicUrl: receivedInvoice.publicUrl,
    //           uuid: receivedInvoice.uuid,
    //           submissionUUID: receivedInvoice.submissionUUID,
    //           fullData: etaInvoiceDetails,
    //           taxStatus: 'ready',
    //           submissionStatus: 'Accepted',
    //           documentDirection: DocumentDirection.RECEIVED,
    //         },
    //         metadata: {
    //           etaInvoice: etaInvoiceDetails,
    //         },
    //       };

    //       //TODO: ADD IN BULK BUT THINK IF ANY ERROR EXIST ?
    //       await this.addInvoice(body);
    //       //console.log('newInvoices 0', newInvoices);
    //     } else {
    //       // update any status or cancel or reject
    //       await this.updateInvoice({
    //         ...findInvoiceByUuid,
    //         taxData: {
    //           ...findInvoiceByUuid.taxData,
    //           taxStatus:
    //             etaInvoiceDetails.status === DocumentFullStatus.SUBMITTED
    //               ? 'pending'
    //               : etaInvoiceDetails.status === DocumentFullStatus.VALID
    //                 ? 'accepted'
    //                 : [DocumentFullStatus.INVALID, DocumentFullStatus.REJECTED].includes(etaInvoiceDetails.status)
    //                   ? 'refused'
    //                   : etaInvoiceDetails.status === DocumentFullStatus.CANCELLED
    //                     ? 'cancelled'
    //                     : 'failed',
    //           fullData: etaInvoiceDetails,
    //         },
    //       });
    //     }
    //   }
    // }

    return true;
  }

  //TODO: Sync All Previous Sent Invoices
  // async syncAllSentInvoicesFromStartOfTheYear(): Promise<true> {}

  //Todo: Ask about sync all eta data
  // async syncAllEtaData(): Promise<true> {}
}
