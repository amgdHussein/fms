import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';

import { User } from '../entities';

export interface IUserRepository extends Repository<User> {
  set(user: Partial<User> & { id: string }): Promise<User>;
  getMany(filters?: QueryFilter[]): Promise<User[]>;
  query(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<User>>;
}
