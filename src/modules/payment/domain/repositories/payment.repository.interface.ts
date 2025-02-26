import { Repository } from '../../../../core/interfaces/repository.interface';
import { QueryOrder } from '../../../../core/queries';
import { QueryFilter } from '../../../../core/queries/query-param.model';
import { Payment } from '../entities';

export interface IPaymentRepository extends Repository<Payment> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Payment[]>;
  addMany(payments: Partial<Payment>[]): Promise<Payment[]>;
}
