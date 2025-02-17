import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import moment from 'moment';
import { ETA_E_RECEIPT_PROVIDER } from '../../../../core/constants';
import { EtaEReceiptService } from '../../../../core/providers';
import { ETA_RECEIPT_QUEUE_PROVIDER, RECEIPT_SERVICE_PROVIDER } from '../../domain';
import { ReceiptStatus, TaxInvoiceStatus } from '../../domain/entities/receipt.entity';
import { ReceiptService } from '../services';

@Processor(ETA_RECEIPT_QUEUE_PROVIDER)
export class EtaEReceiptProcessor {
  private readonly logger: Logger = new Logger(EtaEReceiptProcessor.name);

  constructor(
    @Inject(ETA_E_RECEIPT_PROVIDER)
    private etaEReceiptService: EtaEReceiptService,

    @Inject(RECEIPT_SERVICE_PROVIDER)
    private receiptService: ReceiptService,
  ) {
    this.logger = new Logger(EtaEReceiptProcessor.name);
  }

  @OnQueueActive()
  onActive(job: Job): void {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`);
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any): void {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any): void {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`);
  }

  //TODO: UPDATE INVOICE ON COMPLETE AND STILL SUBMITTED
  @Process({ name: 'fetch-receipt-submission-status', concurrency: 1 })
  async handleTranscode(job: Job): Promise<any> {
    console.log('Start transcoding...');
    // this.logger.debug(job.data);
    console.log('job.data', job.data);

    const etaInvoiceDetails = await this.etaEReceiptService.getReceiptSubmission(
      job.data.submissionUuid,
      {
        PageNo: 1,
        PageSize: 10,
      },
      job.data.credentials,
      job.data.organizationId, // TODO: ADD THIS TO THE MAIN CALL
    );
    console.log('etaInvoiceDetails', etaInvoiceDetails);

    if (etaInvoiceDetails.status === 'InProgress') {
      this.logger.debug('Receipt still in progress');
      throw new HttpException(`The receipt with id(${job.data.uuid}) is still being In Progress.`, HttpStatus.BAD_REQUEST, {
        cause: new Error(`The receipt with id(${job.data.uuid}) is still being In Progress.`),
      });
    } else {
      const receipt = await this.receiptService.getReceipt(job.data.receiptId);
      // const eReceipt = await this.etaEReceiptService.getReceiptDocument(job.data.uuid, job.data.credentials);

      await this.receiptService
        .updateReceipt({
          ...receipt,
          status: etaInvoiceDetails.status === 'Valid' ? ReceiptStatus.SENT : ReceiptStatus.ISSUED,
          taxStatus: etaInvoiceDetails.status === 'Valid' ? TaxInvoiceStatus.ACCEPTED : TaxInvoiceStatus.REJECTED,
          url: `${process.env.ETA_PORTAL_URL}/receipts/search/${etaInvoiceDetails.receipts[0].uuid}/share/${moment(receipt.issuedAt).utc().toISOString()}`, //TODO: TEST THIS DATE IN MOMENT

          //TODO: UNCOMMENT WHEN YOU HAVE INVALID CASE in eta
          errorReasons: etaInvoiceDetails.receipts[0].errors?.length
            ? etaInvoiceDetails.receipts[0].errors.map(error => error?.error?.innerError?.map(innerError => `${innerError?.error}`).join(', '))
            : [],
        })
        .then(() => this.logger.debug('invoice updated'));
      this.logger.debug('Transcoding completed');
      return true;
    }
  }
}
