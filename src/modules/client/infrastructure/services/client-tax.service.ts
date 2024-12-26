import { Inject, Injectable } from '@nestjs/common';

import { Authority } from '../../../../core/common';
import { BadRequestException } from '../../../../core/exceptions';

import { CLIENT_REPOSITORY_PROVIDER, ClientTax, IClientTaxRepository, IClientTaxService } from '../../domain';

@Injectable()
export class ClientTaxService implements IClientTaxService {
  constructor(
    @Inject(CLIENT_REPOSITORY_PROVIDER)
    private readonly repo: IClientTaxRepository,
  ) {}

  async getTax(id: string): Promise<ClientTax> {
    return this.repo.get(id);
  }

  async getClientTax(clientId: string, organizationId: string, authority: Authority): Promise<ClientTax> {
    return this.repo
      .getMany([
        { key: 'clientId', op: 'eq', value: clientId },
        { key: 'organizationId', op: 'eq', value: organizationId },
        { key: 'authority', op: 'eq', value: authority },
      ])
      .then(taxes => {
        if (taxes.length) {
          return taxes[0];
        }

        throw new BadRequestException(`Client has no taxes details with ${authority}!`);
      });
  }

  async addTax(tax: Partial<ClientTax> & { clientId: string; organizationId: string; authority: Authority }): Promise<ClientTax> {
    return this.repo.add(tax);
  }

  async updateTax(tax: Partial<ClientTax> & { id: string }): Promise<ClientTax> {
    return this.repo.update(tax);
  }

  async deleteTax(id: string): Promise<ClientTax> {
    return this.repo.delete(id);
  }
}
