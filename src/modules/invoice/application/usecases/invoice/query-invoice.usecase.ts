import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../../core/models';

import { IInvoiceService, Invoice, INVOICE_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class GetInvoices implements Usecase<Invoice> {
  constructor(
    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,
  ) {}

  async execute(filters?: QueryFilter[], page = 1, limit = 10, order?: QueryOrder): Promise<Invoice[]> {
    order = { key: 'updatedAt', dir: 'desc' }; //TODO: WHAT IF THERE IS ALREADY AN ORDER IN THE FILTERS?
    return this.invoiceService.getInvoices(filters, page, limit, order).then(async invoices => {
      for (const invoice of invoices) {
        invoice.items = await this.invoiceService.getItems(invoice.id);
      }

      return invoices;
    });
  }
}
