import { Inject, Injectable } from '@nestjs/common';

import { IUserPreferencesRepository, IUserPreferencesService, USER_PREFERENCES_REPOSITORY_PROVIDER, UserPreferences } from '../../domain';

@Injectable()
export class UserPreferencesService implements IUserPreferencesService {
  constructor(
    @Inject(USER_PREFERENCES_REPOSITORY_PROVIDER)
    private readonly repo: IUserPreferencesRepository,
  ) {}

  async getPreferences(id: string): Promise<UserPreferences> {
    return this.repo.get(id);
  }

  async addPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return this.repo.add(preferences);
  }

  async setPreferences(preferences: Partial<UserPreferences> & { id: string }): Promise<UserPreferences> {
    return this.repo.set(preferences);
  }

  async updatePreferences(preferences: Partial<UserPreferences> & { id: string }): Promise<UserPreferences> {
    return this.repo.update(preferences);
  }

  async deletePreferences(id: string): Promise<UserPreferences> {
    return this.repo.delete(id);
  }
}
