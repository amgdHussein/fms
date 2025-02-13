import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IInvoiceService, Invoice, INVOICE_SERVICE_PROVIDER, InvoiceStatus } from '../../../domain';

@Injectable()
export class AddInvoice implements Usecase<Invoice> {
  constructor(
    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,
  ) {}

  async execute(invoice: Partial<Invoice> & { organizationId: string; issue: boolean }): Promise<Invoice> {
    invoice.status = InvoiceStatus.ISSUED;

    // TODO: SEND EMAIL TO CLIENT IF ISSUE IS TRUE
    return this.invoiceService.addInvoice(invoice);
  }
}
