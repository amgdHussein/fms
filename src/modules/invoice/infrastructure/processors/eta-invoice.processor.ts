import { Inject, Logger } from '@nestjs/common';

import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { ETA_E_INVOICING_PROVIDER } from '../../../../core/constants';
import { BadRequestException } from '../../../../core/exceptions';
import { DocumentFullStatus, EtaEInvoicingService, EtaInvoice } from '../../../../core/providers';

import { ETA_EINVOICING_QUEUE_PROVIDER, IInvoiceRepository, INVOICE_REPOSITORY_PROVIDER, TaxInvoice, TaxInvoiceStatus } from '../../domain';

@Processor(ETA_EINVOICING_QUEUE_PROVIDER)
export class EtaInvoicingProcessor {
  private readonly logger: Logger = new Logger(EtaInvoicingProcessor.name);

  constructor(
    @Inject(ETA_E_INVOICING_PROVIDER)
    private readonly etaEInvoicing: EtaEInvoicingService,

    @Inject(INVOICE_REPOSITORY_PROVIDER)
    private invoiceRepo: IInvoiceRepository<TaxInvoice>,
  ) {}

  @OnQueueActive()
  onActive(job: Job): void {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`);
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: boolean): void {
    this.logger.log(`Completed job ${job.id} of type ${job.name}. Result: ${result}`);
  }

  @OnQueueFailed()
  onError(job: Job, error: Error): void {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`);
  }

  //TODO: UPDATE INVOICE ON COMPLETE AND STILL SUBMITTED
  @Process({ name: 'refresh-eta-data', concurrency: 1 })
  async handleTranscode(job: Job): Promise<boolean> {
    this.logger.log('Start transcoding...');

    const { uuid, invoiceId, credential, organizationId } = job.data;
    const etaInvoiceDetails: EtaInvoice = await this.etaEInvoicing.getInvoice(uuid, credential, organizationId);

    if (etaInvoiceDetails.status === DocumentFullStatus.SUBMITTED) {
      this.logger.log('Invoice still submitted');
      throw new BadRequestException(`The specified id(${uuid}) is still being processed.`);
    } else {
      await this.invoiceRepo.update({
        id: invoiceId,
        taxStatus: etaInvoiceDetails.status === DocumentFullStatus.VALID ? TaxInvoiceStatus.ACCEPTED : TaxInvoiceStatus.REJECTED,
        url: etaInvoiceDetails.publicUrl,
        updatedBy: job.data.updatedBy,
        // TODO: UPDATE INVOICE WITH ETA DETAILS BY PICKING NEEDED FIELDS (etaInvoiceDetails)
      });

      this.logger.log('Transcoding completed');
      return true;
    }
  }
}
