import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../core/interfaces';

import { IPaymentService, Payment, PAYMENT_SERVICE_PROVIDER } from '../../domain';

@Injectable()
export class DeletePayment implements Usecase<Payment> {
  constructor(
    @Inject(PAYMENT_SERVICE_PROVIDER)
    private readonly paymentService: IPaymentService,
  ) {}

  async execute(id: string): Promise<Payment> {
    return this.paymentService.deletePayment(id);
  }
}
