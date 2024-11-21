import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IInvoiceService, Invoice, INVOICE_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class UpdateInvoice implements Usecase<Invoice> {
  constructor(
    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,
  ) {}

  async execute(invoice: Partial<Invoice> & { id: string }): Promise<Invoice> {
    return this.invoiceService.updateInvoice(invoice);
  }
}
