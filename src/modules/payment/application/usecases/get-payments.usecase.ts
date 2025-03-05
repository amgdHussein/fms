import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { IPaymentService, Payment, PAYMENT_SERVICE_PROVIDER } from '../../domain';

@Injectable()
export class GetPayments implements Usecase<Payment> {
  constructor(
    @Inject(PAYMENT_SERVICE_PROVIDER)
    private readonly paymentService: IPaymentService,
  ) {}

  async execute(page = 1, limit = 10, filters?: QueryFilter[], order?: QueryOrder): Promise<Payment[]> {
    return this.paymentService.getPayments(filters, page, limit, order);
  }
}
