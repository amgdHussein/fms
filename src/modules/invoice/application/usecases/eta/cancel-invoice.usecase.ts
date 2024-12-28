import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Invoice } from '../../../../invoice/domain';

import { ETA_INVOICE_SERVICE_PROVIDER, IEtaInvoiceService } from '../../../domain';

@Injectable()
export class CancelEtaInvoice implements Usecase<Invoice> {
  constructor(
    @Inject(ETA_INVOICE_SERVICE_PROVIDER)
    private readonly etaInvoiceService: IEtaInvoiceService,
  ) {}

  async execute(id: string, uuid: string, status: 'cancelled' | 'rejected', reason: string): Promise<Invoice> {
    return this.etaInvoiceService.cancelInvoice(id, uuid, status, reason);
  }
}
