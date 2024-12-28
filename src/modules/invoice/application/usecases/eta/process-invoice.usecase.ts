import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Invoice } from '../../../../invoice/domain';

import { ETA_INVOICE_SERVICE_PROVIDER, IEtaInvoiceService } from '../../../domain';

@Injectable()
export class ProcessEtaInvoices implements Usecase<Invoice> {
  constructor(
    @Inject(ETA_INVOICE_SERVICE_PROVIDER)
    private readonly etaInvoiceService: IEtaInvoiceService,
  ) {}

  async execute(ids: string[]): Promise<boolean> {
    return this.etaInvoiceService.processInvoices(ids);
  }
}
