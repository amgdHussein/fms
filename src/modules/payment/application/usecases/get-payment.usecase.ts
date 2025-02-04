import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../core/interfaces/usecase.interface';
import { IPaymentService, Payment, PAYMENT_SERVICE_PROVIDER } from '../../domain';

@Injectable()
export class GetPayment implements Usecase<Payment> {
  constructor(
    @Inject(PAYMENT_SERVICE_PROVIDER)
    private readonly paymentService: IPaymentService,
  ) {}

  async execute(id: string): Promise<Payment> {
    return await this.paymentService.getPayment(id);
  }
}
