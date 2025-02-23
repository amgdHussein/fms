import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
// import {
//   EReceiptCredentials,
//   ETA_ERECEIPT_QUEUE_PROVIDER,
//   ETA_ERECEIPT_SERVICE_PROVIDER,
//   EtaEReceiptService,
// } from '../../../../core/providers';
// import { getMappedEtaReceipt } from '../../../../core/providers/tax-authority/eta/services/e-receipt-helper';
import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, ETA_E_RECEIPT_PROVIDER } from '../../../../core/constants';
import { EtaEReceiptService } from '../../../../core/providers';
import { EReceiptCredentials } from '../../../../core/providers/eta/temp-entity/receipt.entity';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/queries';
import { Code, CODE_SERVICE_PROVIDER } from '../../../code/domain';
import { CodeService } from '../../../code/infrastructure';
import { BRANCH_SERVICE_PROVIDER } from '../../../organization/domain';
import { BranchService } from '../../../organization/infrastructure';
import { ETA_RECEIPT_QUEUE_PROVIDER, IReceiptRepository, IReceiptService, Receipt, RECEIPT_REPOSITORY_PROVIDER } from '../../domain';
import { ReceiptStatus, TaxInvoiceStatus } from '../../domain/entities/receipt.entity';
import { getMappedEtaReceipt } from './e-receipt-helper';

@Injectable()
export class ReceiptService implements IReceiptService {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(CODE_SERVICE_PROVIDER)
    private readonly codeService: CodeService,

    @Inject(BRANCH_SERVICE_PROVIDER)
    private organizationBranchService: BranchService,

    @Inject(ETA_E_RECEIPT_PROVIDER)
    private etaEReceiptService: EtaEReceiptService,

    @Inject(RECEIPT_REPOSITORY_PROVIDER)
    private readonly repo: IReceiptRepository,

    @InjectQueue(ETA_RECEIPT_QUEUE_PROVIDER)
    private readonly etaEReceiptQueue: Queue,
  ) {}

  async getReceipts(): Promise<Receipt[]> {
    return await this.repo.getAll();
  }

  async queryReceipts(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Receipt>> {
    return await this.repo.query(page, limit, filters, order);
  }

  async getReceipt(id: string): Promise<Receipt> {
    return await this.repo.get(id);
  }

  async addReceipt(receipt: Receipt): Promise<Receipt> {
    return this.repo.add(receipt);
  }

  async addReceipts(receipts: Receipt[]): Promise<Receipt[]> {
    return await this.repo.addBatch(receipts);
  }

  async updateReceipt(receipt: Partial<Receipt> & { id: string }): Promise<Receipt> {
    return await this.repo.update(receipt);
  }

  async deleteReceipt(id: string): Promise<Receipt> {
    return await this.repo.delete(id);
  }

  async sendToEta(receipt: Receipt): Promise<any> {
    console.log('send to eta fun run');
    const branch = await this.organizationBranchService.getBranch(receipt.branchId);

    const selectedPos = branch.posDevices.find(pos => pos.serialNo === receipt.posId);

    const credentials: EReceiptCredentials = {
      clientId: selectedPos.credentials.clientId,
      clientSecret: selectedPos.credentials.clientSecret,
      pos: selectedPos,
    };

    const itemsCodes = await this.getUsedCodes(receipt);
    // console.log('itemsCodes', itemsCodes.length);

    const etaDocument = getMappedEtaReceipt(receipt, itemsCodes, branch, credentials);

    // console.log('etaDocument', JSON.stringify(etaDocument));

    const response = await this.etaEReceiptService.submitReceiptDocuments(etaDocument, credentials, receipt.organizationId);

    // https://preprod.invoicing.eta.gov.eg/receipts/search/f3a038ff51d9d948126fb65c9db9b620ccf2b9ddc4d20faf823bd4cf805e2d6d/share/2024-12-09T14:13:42Z

    receipt.status = ReceiptStatus.ISSUED;
    receipt.taxStatus = response.acceptedDocuments?.length ? TaxInvoiceStatus.SUBMITTED : TaxInvoiceStatus.REJECTED;
    receipt.uuid = response.acceptedDocuments[0]?.uuid ?? ''; // TODO: HANDLE THIS IN BETTER WAY WHEN NO ACCEPT DOCUMENTS RETURNED => TRY MAKE BUG IN ISSUEDATE AND TEST IT
    receipt.submissionUuid = response.submissionId ?? '';
    receipt.rejectedSubmission = response.rejectedDocuments?.length ? response.rejectedDocuments : {};
    receipt.errorReasons = response.rejectedDocuments?.length
      ? response.rejectedDocuments?.map(doc => doc.error.details.map(detail => `${detail.target}: ${detail.message}`).join(', '))
      : [];

    // console.log('submitReceiptDocuments response', response);

    console.log('receipt', receipt);

    await this.updateReceipt(JSON.parse(JSON.stringify(receipt)));

    if (response.acceptedDocuments?.length) {
      this.etaEReceiptQueue
        .add(
          'fetch-receipt-submission-status',
          {
            uuid: response.acceptedDocuments[0]?.uuid,
            submissionUuid: response.submissionId,
            receiptId: receipt.id,
            credentials: credentials,
            organizationId: receipt.organizationId,
            updatedBy: this.authService.currentUser.uid,
          },
          {
            attempts: 4,
            removeOnComplete: true,
            removeOnFail: true,
            backoff: 10000,
          },
        )
        .then(res => console.log('success in queue'));
      // .catch(err => console.log('failed in queue', err));
    }

    return response;
  }

  async sendMultipleToEta(receipt: Receipt[]): Promise<any> {
    console.log('sendMultipleToEta fun run');

    for (let index = 0; index < receipt.length; index++) {
      // const element = array[index];
      await this.sendToEta(receipt[index]);
    }
  }

  // Helper function to split the clientIDs into chunks of 30
  chunkArray(array: string[]): string[][] {
    const chunks = [];
    const chunkLimit = 30; // Limit of 30 IDs per request or firestore throw error
    for (let i = 0; i < array.length; i += chunkLimit) {
      chunks.push(array.slice(i, i + chunkLimit));
    }
    return chunks;
  }

  async getUsedCodes(receipt: Receipt): Promise<Code[]> {
    console.log('load invoices run');

    const clientIDs = [...new Set(receipt.items.map(item => item.codeId))];

    const codes: Code[] = [];

    for (const id of clientIDs) {
      const code = await this.codeService.getCode(id, receipt.organizationId);
      codes.push(code);
    }

    return codes;
    // const chunkedClientIDs = this.chunkArray(clientIDs); // Chunk by 30 IDs
    // console.log('chunkedClientIDs', chunkedClientIDs);

    // const promises = chunkedClientIDs.map(async chunk => {
    //   console.log('chunk', chunk);

    //TODO: FIX THIS QUERY
    //   const invoices = await this.codeService.getCodes(1, 5000, [
    //     {
    //       key: 'systemId',
    //       operator: 'eq',
    //       value: receipt.systemId,
    //     },
    //     {
    //       key: 'id',
    //       operator: 'in',
    //       value: chunk,
    //     },
    //     {
    //       key: 'isProductionMode',
    //       operator: 'eq',
    //       value: receipt.isProductionMode,
    //     },
    //   ]);

    //   return invoices.data;
    // });

    // const results = await Promise.all(promises);
    // console.log('results', results);

    // return results.flat(); // Flatten the array of results
  }
}
