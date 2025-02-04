import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../core/interfaces/usecase.interface';
import { Invoice } from '../../../invoice/domain';
import { IPaymentService, Payment, PAYMENT_SERVICE_PROVIDER } from '../../domain';

@Injectable()
export class CreateStripeInvoice implements Usecase<Payment> {
  constructor(
    @Inject(PAYMENT_SERVICE_PROVIDER)
    private readonly paymentService: IPaymentService,
  ) {}

  async execute(invoice: Invoice): Promise<string> {
    return await this.paymentService.createStripeInvoice(invoice);
  }
}
