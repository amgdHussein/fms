import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IInvoiceService, Invoice, INVOICE_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class GetInvoice implements Usecase<Invoice> {
  constructor(
    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,
  ) {}

  async execute(id: string): Promise<Invoice> {
    return this.invoiceService.getInvoice(id).then(async invoice => {
      invoice.items = await this.invoiceService.getItems(id);
      return invoice;
    });
  }
}
