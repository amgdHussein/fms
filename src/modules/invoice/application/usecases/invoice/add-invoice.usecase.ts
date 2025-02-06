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
    const { items, ...invoiceData } = invoice;
    invoiceData.status = InvoiceStatus.ISSUED;

    return this.invoiceService.addInvoice(invoiceData).then(async invoice => {
      // TODO: SEND EMAIL TO CLIENT IF ISSUE IS TRUE
      if (items && items.length) {
        invoice.items = await this.invoiceService.addItems(items, invoice.id);
      }

      return invoice;
    });
  }
}
