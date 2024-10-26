import { Inject, Injectable } from '@nestjs/common';

import { ACCOUNT_PREFERENCES_REPOSITORY_PROVIDER, AccountPreferences, IAccountPreferencesRepository, IAccountPreferencesService } from '../../domain';

@Injectable()
export class AccountPreferencesService implements IAccountPreferencesService {
  constructor(
    @Inject(ACCOUNT_PREFERENCES_REPOSITORY_PROVIDER)
    private readonly repo: IAccountPreferencesRepository,
  ) {}

  async getPreferences(id: string): Promise<AccountPreferences> {
    return this.repo.get(id);
  }

  async addPreferences(preferences: Partial<AccountPreferences & { accountId: string }>): Promise<AccountPreferences> {
    return this.repo.add(preferences);
  }

  async updatePreferences(preferences: Partial<AccountPreferences> & { id: string }): Promise<AccountPreferences> {
    return this.repo.update(preferences);
  }

  async deletePreferences(id: string): Promise<AccountPreferences> {
    return this.repo.delete(id);
  }
}
