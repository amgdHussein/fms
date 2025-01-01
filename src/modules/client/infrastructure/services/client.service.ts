import { Inject, Injectable } from '@nestjs/common';

import { QueryFilter, QueryOrder } from '../../../../core/models';

import { Client, CLIENT_REPOSITORY_PROVIDER, IClientRepository, IClientService } from '../../domain';

@Injectable()
export class ClientService implements IClientService {
  constructor(
    @Inject(CLIENT_REPOSITORY_PROVIDER)
    private readonly repo: IClientRepository,
  ) {}

  async getClient(id: string): Promise<Client> {
    return this.repo.get(id);
  }

  async getClients(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Client[]> {
    return this.repo.getMany(filters, page, limit, order);
  }

  async addClient(client: Partial<Client>): Promise<Client> {
    return this.repo.add(client);
  }

  async addClients(clients: Partial<Client>[]): Promise<Client[]> {
    return this.repo.addMany(clients);
  }

  async updateClient(clients: Partial<Client> & { id: string }): Promise<Client> {
    return this.repo.update(clients);
  }

  async deleteClient(id: string): Promise<Client> {
    return this.repo.delete(id);
  }
}
