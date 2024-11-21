import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';

import { Client } from '../entities';

export interface IClientService {
  getClient(id: string): Promise<Client>;
  getClients(filters?: QueryFilter[]): Promise<Client[]>;
  queryClients(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Client>>;
  addClient(client: Partial<Client>): Promise<Client>;
  addClients(clients: Partial<Client>[]): Promise<Client[]>;
  updateClient(client: Partial<Client> & { id: string }): Promise<Client>;
  deleteClient(id: string): Promise<Client>;
}
