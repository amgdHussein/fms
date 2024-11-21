import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Client, CLIENT_SERVICE_PROVIDER, IClientService } from '../../../domain';

@Injectable()
export class AddClients implements Usecase<Client> {
  constructor(
    @Inject(CLIENT_SERVICE_PROVIDER)
    private readonly clientService: IClientService,
  ) {}

  async execute(clients: Partial<Client>[]): Promise<Client[]> {
    return this.clientService.addClients(clients);
  }
}
