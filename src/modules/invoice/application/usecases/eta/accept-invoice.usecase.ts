import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Invoice } from '../../../../invoice/domain';

import { ETA_INVOICE_SERVICE_PROVIDER, IEtaInvoiceService } from '../../../domain';

@Injectable()
export class AcceptEtaInvoice implements Usecase<Invoice> {
  constructor(
    @Inject(ETA_INVOICE_SERVICE_PROVIDER)
    private readonly etaInvoiceService: IEtaInvoiceService,
  ) {}

  async execute(id: string): Promise<Invoice> {
    return this.etaInvoiceService.acceptInvoice(id);
  }
}
