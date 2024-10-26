import { Inject, Injectable } from '@nestjs/common';

import { LOCKER_PROVIDER } from '../../../../core/constants';
import { LockerService } from '../../../../core/providers';

import { IUserPreferencesRepository, IUserPreferencesService, USER_PREFERENCES_REPOSITORY_PROVIDER, UserPreferences } from '../../domain';

@Injectable()
export class UserPreferencesService implements IUserPreferencesService {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(USER_PREFERENCES_REPOSITORY_PROVIDER)
    private readonly repo: IUserPreferencesRepository,
  ) {}

  async getPreferences(id: string): Promise<UserPreferences> {
    return this.repo.get(id);
  }

  async addPreferences(preferences: Partial<UserPreferences & { userId: string }>): Promise<UserPreferences> {
    // Initiate some fields
    preferences.createdBy = this.locker.user.uid;
    preferences.createdAt = Date.now();
    preferences.updatedBy = this.locker.user.uid;
    preferences.updatedAt = Date.now();

    return this.repo.add(preferences);
  }

  async updatePreferences(preferences: Partial<UserPreferences> & { id: string }): Promise<UserPreferences> {
    // Update some fields
    preferences.updatedBy = this.locker.user.uid;
    preferences.updatedAt = Date.now();

    return this.repo.update(preferences);
  }

  async deletePreferences(id: string): Promise<UserPreferences> {
    return this.repo.delete(id);
  }
}
