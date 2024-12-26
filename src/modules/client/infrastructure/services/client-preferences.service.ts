import { Inject, Injectable } from '@nestjs/common';

import { CLIENT_PREFERENCES_REPOSITORY_PROVIDER, ClientPreferences, IClientPreferencesRepository, IClientPreferencesService } from '../../domain';

@Injectable()
export class ClientPreferencesService implements IClientPreferencesService {
  constructor(
    @Inject(CLIENT_PREFERENCES_REPOSITORY_PROVIDER)
    private readonly repo: IClientPreferencesRepository,
  ) {}

  async getPreferences(id: string): Promise<ClientPreferences> {
    return this.repo.get(id);
  }

  async addPreferences(preferences: Partial<ClientPreferences> & { clientId: string }): Promise<ClientPreferences> {
    return this.repo.add(preferences);
  }

  async updatePreferences(preferences: Partial<ClientPreferences> & { id: string }): Promise<ClientPreferences> {
    return this.repo.update(preferences);
  }

  async deletePreferences(id: string): Promise<ClientPreferences> {
    return this.repo.delete(id);
  }
}
