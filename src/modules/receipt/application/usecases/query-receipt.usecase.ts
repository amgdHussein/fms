import { Inject, Injectable } from '@nestjs/common';
import { Usecase } from '../../../../core/interfaces/usecase.interface';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/queries';
import { IReceiptService, Receipt, RECEIPT_SERVICE_PROVIDER } from '../../domain';

@Injectable()
export class QueryReceipts implements Usecase<Receipt> {
  constructor(
    @Inject(RECEIPT_SERVICE_PROVIDER)
    private readonly receiptService: IReceiptService,
  ) {}

  async execute(page = 1, limit = 10, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Receipt>> {
    return await this.receiptService.queryReceipts(page, limit, filters, order);
  }
}
