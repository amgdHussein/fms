import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../core/interfaces';

import { IPaymentService, Payment, PAYMENT_SERVICE_PROVIDER } from '../../domain';

@Injectable()
export class AddPayment implements Usecase<Payment> {
  constructor(
    @Inject(PAYMENT_SERVICE_PROVIDER)
    private readonly paymentService: IPaymentService,
  ) {}

  async execute(payment: Partial<Payment>): Promise<Payment> {
    return await this.paymentService.addPayment(payment);
  }
}
