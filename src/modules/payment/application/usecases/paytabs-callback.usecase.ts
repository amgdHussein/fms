import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../core/interfaces/usecase.interface';
import { IPaymentService, Payment, PAYMENT_SERVICE_PROVIDER } from '../../domain';

@Injectable()
export class PaytabsCallback implements Usecase<Payment> {
  constructor(
    @Inject(PAYMENT_SERVICE_PROVIDER)
    private readonly paymentService: IPaymentService,
  ) {}

  async execute(data: any): Promise<any> {
    return await this.paymentService.paytabsCallback(data);
  }
}
