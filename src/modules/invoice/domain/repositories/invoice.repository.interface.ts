import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/models';

export interface IInvoiceRepository<T> extends Repository<T> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<T[]>;
  updateMany(invoices: (Partial<T> & { id: string })[]): Promise<T[]>;
}
