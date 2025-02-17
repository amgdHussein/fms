import { Repository } from '../../../../core/interfaces/repository.interface';
import { QueryOrder } from '../../../../core/models';
import { QueryFilter } from '../../../../core/models/query-param.model';
import { Payment } from '../entities';

export interface IPaymentRepository extends Repository<Payment> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Payment[]>;
  addMany(payments: Partial<Payment>[]): Promise<Payment[]>;
}
