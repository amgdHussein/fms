import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';

import { Client } from '../entities';

export interface IClientRepository extends Repository<Client> {
  getMany(filters?: QueryFilter[]): Promise<Client[]>;
  query(page: number, limit: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Client>>;
  addMany(clients: Partial<Client>[]): Promise<Client[]>;
}
