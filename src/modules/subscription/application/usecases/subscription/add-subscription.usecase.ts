import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IInvoiceService, INVOICE_SERVICE_PROVIDER } from '../../../../invoice/domain';
import { ISubscriptionService, Subscription, SUBSCRIPTION_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class AddSubscription implements Usecase<Subscription> {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE_PROVIDER)
    private readonly subscriptionService: ISubscriptionService,

    @Inject(INVOICE_SERVICE_PROVIDER)
    private readonly invoiceService: IInvoiceService,
  ) {}

  async execute(subscription: Partial<Subscription> & { organizationId: string; planId: string }): Promise<Subscription> {
    const result = await this.subscriptionService.addSubscription(subscription);
    // const invoice: SubscriptionInvoice = {
    //   subscriptionId: result.id,
    //   organizationId: 'mofawtar', // TODO: ADD MOFAWTAR ORGANIZATION ID
    //   clientId: result.organizationId,
    //   type: InvoiceType.STANDARD,
    //   form: InvoiceForm.INVOICE,
    //   direction: InvoiceDirection.SENT,
    //   items: [], // TODO: ADD ITEM STATIC FOR THE GIVEN PLAN AND SUBSCRIPTION CYCLE
    //   issuer: {},
    //   receiver: {},
    //   logo: {}, // TODO: ADD MOFAWTAR LOGO
    // };

    // await this.invoiceService.addInvoice(invoice);

    return result;
  }
}
