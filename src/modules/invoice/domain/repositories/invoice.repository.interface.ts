import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';

export interface IInvoiceRepository<T> extends Repository<T> {
  getMany(filters?: QueryFilter[]): Promise<T[]>;
  updateMany(invoices: (Partial<T> & { id: string })[]): Promise<T[]>;
  query(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<T>>;
}
