import { Repository } from '../../../../core/interfaces/repository.interface';
import { QueryOrder, QueryResult } from '../../../../core/models';
import { QueryFilter } from '../../../../core/models/query-param.model';
import { Payment } from '../entities';

export interface IPaymentRepository extends Repository<Payment> {
  getAll(): Promise<Payment[]>;
  query(page: number, limit: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Payment>>;
  addBatch(payments: Payment[]): Promise<Payment[]>;
}
