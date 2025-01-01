import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Client, CLIENT_PREFERENCES_SERVICE_PROVIDER, CLIENT_SERVICE_PROVIDER, IClientPreferencesService, IClientService } from '../../../domain';

@Injectable()
export class DeleteClient implements Usecase<Client> {
  constructor(
    @Inject(CLIENT_SERVICE_PROVIDER)
    private readonly clientService: IClientService,

    @Inject(CLIENT_PREFERENCES_SERVICE_PROVIDER)
    private readonly preferencesService: IClientPreferencesService,
  ) {}

  async execute(id: string): Promise<Client> {
    return this.clientService.deleteClient(id).then(async client => {
      // Delete client related data
      await this.preferencesService.deletePreferences(id);

      return client;
    });
  }
}
