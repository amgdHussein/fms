import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IInvoiceService, INVOICE_SERVICE_PROVIDER, Item } from '../../../domain';

@Injectable()
export class GetInvoiceItems implements Usecase<Item> {
  constructor(
    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,
  ) {}

  async execute(invoiceId: string): Promise<Item[]> {
    return this.invoiceService.getItems(invoiceId);
  }
}
