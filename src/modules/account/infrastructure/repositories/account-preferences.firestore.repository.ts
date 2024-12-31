import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';

import { AccountPreferences, IAccountPreferencesRepository } from '../../domain';

@Injectable()
export class AccountPreferencesFirestoreRepository implements IAccountPreferencesRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.ACCOUNTS_PREFERENCES)
    private readonly db: FirestoreService<AccountPreferences>,
  ) {}

  async get(id: string): Promise<AccountPreferences> {
    return this.db.getDoc(id);
  }

  async add(preferences: Partial<AccountPreferences>): Promise<AccountPreferences> {
    // Initiate some fields
    preferences.createdBy = this.authService.currentUser.uid;
    preferences.createdAt = Date.now();
    preferences.updatedBy = this.authService.currentUser.uid;
    preferences.updatedAt = Date.now();

    return this.db.addDoc(preferences);
  }

  async update(preferences: Partial<AccountPreferences> & { id: string }): Promise<AccountPreferences> {
    // Update some fields
    preferences.updatedBy = this.authService.currentUser.uid;
    preferences.updatedAt = Date.now();

    return this.db.updateDoc(preferences);
  }

  async delete(id: string): Promise<AccountPreferences> {
    return this.db.deleteDoc(id);
  }
}
