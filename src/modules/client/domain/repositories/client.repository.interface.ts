import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { Client } from '../entities';

export interface IClientRepository extends Repository<Client> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Client[]>;
  addMany(clients: Partial<Client>[]): Promise<Client[]>;
}
