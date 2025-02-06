import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Client, CLIENT_SERVICE_PROVIDER, IClientService } from '../../../domain';

@Injectable()
export class GetOrganizationClients implements Usecase<Client> {
  constructor(
    @Inject(CLIENT_SERVICE_PROVIDER)
    private readonly clientService: IClientService,
  ) {}

  async execute(organizationId: string): Promise<Client[]> {
    return this.clientService.getClients([{ key: 'organizationId', operator: 'eq', value: organizationId }]);
  }
}
