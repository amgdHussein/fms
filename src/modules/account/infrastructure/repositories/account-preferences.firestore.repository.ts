import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { AccountPreferences, IAccountPreferencesRepository } from '../../domain';

@Injectable()
export class AccountPreferencesFirestoreRepository implements IAccountPreferencesRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.ACCOUNTS_PREFERENCES)
    private readonly db: FirestoreService<AccountPreferences>,
  ) {}

  async get(id: string): Promise<AccountPreferences> {
    return this.db.getDoc(id);
  }

  async add(preferences: Partial<AccountPreferences>): Promise<AccountPreferences> {
    // Initiate some fields
    preferences.createdBy = this.locker.user.uid;
    preferences.createdAt = Date.now();
    preferences.updatedBy = this.locker.user.uid;
    preferences.updatedAt = Date.now();

    return this.db.addDoc(preferences);
  }

  async update(preferences: Partial<AccountPreferences> & { id: string }): Promise<AccountPreferences> {
    // Update some fields
    preferences.updatedBy = this.locker.user.uid;
    preferences.updatedAt = Date.now();

    return this.db.updateDoc(preferences);
  }

  async delete(id: string): Promise<AccountPreferences> {
    return this.db.deleteDoc(id);
  }
}
