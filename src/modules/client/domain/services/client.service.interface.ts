import { QueryFilter, QueryOrder } from '../../../../core/models';

import { Client } from '../entities';

export interface IClientService {
  getClient(id: string): Promise<Client>;
  getClients(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Client[]>;
  getClientByTaxNumber(taxIdNo: string, organizationId: string): Promise<Client>;
  addClient(client: Partial<Client>): Promise<Client>;
  addClients(clients: Partial<Client>[]): Promise<Client[]>;
  updateClient(client: Partial<Client> & { id: string }): Promise<Client>;
  deleteClient(id: string): Promise<Client>;
}
