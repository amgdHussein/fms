import { Inject, Injectable } from '@nestjs/common';
import { Usecase } from '../../../../core/interfaces/usecase.interface';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';
import { IPaymentService, Payment, PAYMENT_SERVICE_PROVIDER } from '../../domain';

@Injectable()
export class QueryPayments implements Usecase<Payment> {
  constructor(
    @Inject(PAYMENT_SERVICE_PROVIDER)
    private readonly paymentService: IPaymentService,
  ) {}

  async execute(page = 1, limit = 10, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Payment>> {
    return await this.paymentService.queryPayments(page, limit, filters, order);
  }
}
