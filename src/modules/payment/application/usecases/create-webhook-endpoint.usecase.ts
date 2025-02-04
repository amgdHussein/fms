import { Inject, Injectable } from '@nestjs/common';

import Stripe from 'stripe';
import { Usecase } from '../../../../core/interfaces/usecase.interface';
import { IPaymentService, Payment, PAYMENT_SERVICE_PROVIDER } from '../../domain';

@Injectable()
export class CreateWebhookEndpoint implements Usecase<Payment> {
  constructor(
    @Inject(PAYMENT_SERVICE_PROVIDER)
    private readonly paymentService: IPaymentService,
  ) {}

  async execute(): Promise<Stripe.WebhookEndpoint> {
    return await this.paymentService.createWebhookEndpoint();
  }
}
