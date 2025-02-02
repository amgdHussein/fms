import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Client, CLIENT_PREFERENCES_SERVICE_PROVIDER, CLIENT_SERVICE_PROVIDER, ClientStatus, IClientPreferencesService, IClientService } from '../../../domain';

@Injectable()
export class AddClient implements Usecase<Client> {
  constructor(
    @Inject(CLIENT_SERVICE_PROVIDER)
    private readonly clientService: IClientService,

    @Inject(CLIENT_PREFERENCES_SERVICE_PROVIDER)
    private readonly preferencesService: IClientPreferencesService,
  ) {}

  async execute(client: Partial<Client>): Promise<Client> {
    client.status = ClientStatus.ACTIVE;

    return this.clientService.addClient(client).then(async client => {
      // Add client related data
      await this.preferencesService.setPreferences({
        id: client.id,
        currencies: client.currency ? [client.currency] : [],
      });

      return client;
    });
  }
}
