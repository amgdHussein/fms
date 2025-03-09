import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { SubscriptionInvoice } from '../../../../subscription/domain';
import { IInvoiceService, Invoice, INVOICE_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class GetSubscriptionInvoices implements Usecase<SubscriptionInvoice> {
  constructor(
    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,
  ) {}

  async execute(subscriptionId: string): Promise<Invoice[]> {
    return this.invoiceService.getInvoices([{ key: 'subscriptionId', operator: 'eq', value: subscriptionId }]);
  }
}
