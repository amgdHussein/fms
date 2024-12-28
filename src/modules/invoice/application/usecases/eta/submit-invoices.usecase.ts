import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';
import { AddEtaInvoice } from '../../../../../core/providers';

import { ETA_INVOICE_SERVICE_PROVIDER, IEtaInvoiceService, Invoice } from '../../../domain';

@Injectable()
export class SubmitEtaInvoices implements Usecase<Invoice> {
  constructor(
    @Inject(ETA_INVOICE_SERVICE_PROVIDER)
    private readonly etaInvoiceService: IEtaInvoiceService,
  ) {}

  async execute(invoices: (AddEtaInvoice & { invoiceId: string })[], organizationId: string): Promise<void> {
    return this.etaInvoiceService.submitInvoices(invoices, organizationId);
  }
}
