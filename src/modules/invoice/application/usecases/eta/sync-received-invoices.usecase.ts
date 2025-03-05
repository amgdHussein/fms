import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { ETA_INVOICE_SERVICE_PROVIDER, IEtaInvoiceService } from '../../../domain';

@Injectable()
export class SyncReceivedInvoices implements Usecase<any> {
  constructor(
    @Inject(ETA_INVOICE_SERVICE_PROVIDER)
    private readonly etaInvoiceService: IEtaInvoiceService,
  ) {}

  async execute(organizationId: string): Promise<any> {
    return this.etaInvoiceService.syncReceivedInvoices(organizationId);
  }
}
