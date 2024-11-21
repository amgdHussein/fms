import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../../core/models';

import { IInvoiceService, Invoice, INVOICE_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class QueryInvoices implements Usecase<Invoice> {
  constructor(
    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,
  ) {}

  async execute(page = 1, limit = 10, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Invoice>> {
    return this.invoiceService.queryInvoices(page, limit, filters, order).then(async result => {
      for (const invoice of result.data) {
        invoice.items = await this.invoiceService.getItems(invoice.id);
      }

      return result;
    });
  }
}
