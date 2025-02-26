import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { User } from '../entities';

export interface IUserRepository extends Repository<User> {
  set(user: Partial<User> & { id: string }): Promise<User>;
  getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<User[]>;
}
