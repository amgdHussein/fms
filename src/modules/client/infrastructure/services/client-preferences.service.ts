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

  async addPreferences(preferences: Partial<ClientPreferences>): Promise<ClientPreferences> {
    return this.repo.add(preferences);
  }

  async setPreferences(preferences: Partial<ClientPreferences> & { id: string }): Promise<ClientPreferences> {
    return this.repo.set(preferences);
  }

  async updatePreferences(preferences: Partial<ClientPreferences> & { id: string }): Promise<ClientPreferences> {
    return this.repo.update(preferences);
  }

  async deletePreferences(id: string): Promise<ClientPreferences> {
    return this.repo.delete(id);
  }
}
