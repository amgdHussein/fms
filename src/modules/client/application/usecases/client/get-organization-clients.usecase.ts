import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Client, CLIENT_SERVICE_PROVIDER, IClientService } from '../../../domain';

@Injectable()
export class GetOrganizationClients implements Usecase<Client> {
  constructor(
    @Inject(CLIENT_SERVICE_PROVIDER)
    private readonly clientService: IClientService,
  ) {}

  async execute(systemId: string): Promise<Client[]> {
    return this.clientService.getClients([{ key: 'systemId', op: 'eq', value: systemId }]);
  }
}
