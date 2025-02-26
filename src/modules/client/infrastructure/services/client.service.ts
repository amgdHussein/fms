import { Inject, Injectable } from '@nestjs/common';

import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { BadRequestException } from '../../../../core/exceptions';
import { Client, CLIENT_REPOSITORY_PROVIDER, IClientRepository, IClientService } from '../../domain';

@Injectable()
export class ClientService implements IClientService {
  constructor(
    @Inject(CLIENT_REPOSITORY_PROVIDER)
    private readonly clientRepo: IClientRepository,
  ) {}

  async getClient(id: string): Promise<Client> {
    return this.clientRepo.get(id);
  }

  async getClients(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Client[]> {
    return this.clientRepo.getMany(filters, page, limit, order);
  }

  async getClientByTaxNumber(taxIdNo: string, organizationId: string): Promise<Client> {
    return this.clientRepo
      .getMany([
        { key: 'identificationId', operator: 'eq', value: taxIdNo },
        { key: 'organizationId', operator: 'eq', value: organizationId },
      ])
      .then(clients => {
        if (clients.length) {
          return clients[0];
        }

        throw new BadRequestException(`No client with tax number ${taxIdNo}!`);
      });
  }

  async addClient(client: Partial<Client>): Promise<Client> {
    return this.clientRepo.add(client);
  }

  async addClients(clients: Partial<Client>[]): Promise<Client[]> {
    return this.clientRepo.addMany(clients);
  }

  async updateClient(clients: Partial<Client> & { id: string }): Promise<Client> {
    return this.clientRepo.update(clients);
  }

  async deleteClient(id: string): Promise<Client> {
    return this.clientRepo.delete(id);
  }
}
