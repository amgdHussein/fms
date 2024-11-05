import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';

import { Invoice } from '../entities';

export interface IInvoiceRepository extends Repository<Invoice> {
  getMany(filters?: QueryFilter[]): Promise<Invoice[]>;
  query(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Invoice>>;
}
