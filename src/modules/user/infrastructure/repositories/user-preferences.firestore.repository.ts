import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { IUserPreferencesRepository, UserPreferences } from '../../domain';

@Injectable()
export class UserPreferencesFirestoreRepository implements IUserPreferencesRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.USERS_PREFERENCES)
    private readonly db: FirestoreService<UserPreferences>,
  ) {}

  async get(id: string): Promise<UserPreferences> {
    return this.db.getDoc(id);
  }

  async add(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    // Initiate some fields
    preferences.createdBy = this.locker.user.uid;
    preferences.createdAt = Date.now();
    preferences.updatedBy = this.locker.user.uid;
    preferences.updatedAt = Date.now();

    return this.db.addDoc(preferences);
  }

  async update(preferences: Partial<UserPreferences> & { id: string }): Promise<UserPreferences> {
    // Update some fields
    preferences.updatedBy = this.locker.user.uid;
    preferences.updatedAt = Date.now();

    return this.db.updateDoc(preferences);
  }

  async delete(id: string): Promise<UserPreferences> {
    return this.db.deleteDoc(id);
  }
}
