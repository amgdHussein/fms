import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';

import { IUserPreferencesRepository, UserPreferences } from '../../domain';

@Injectable()
export class UserPreferencesFirestoreRepository implements IUserPreferencesRepository {
  constructor(
    @Inject(FIRESTORE_COLLECTION_PROVIDERS.USERS_PREFERENCES)
    private readonly db: FirestoreService<UserPreferences>,
  ) {}

  async get(id: string): Promise<UserPreferences> {
    return this.db.getDoc(id);
  }

  async add(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return this.db.addDoc(preferences);
  }

  async update(preferences: Partial<UserPreferences> & { id: string }): Promise<UserPreferences> {
    return this.db.updateDoc(preferences);
  }

  async delete(id: string): Promise<UserPreferences> {
    return this.db.deleteDoc(id);
  }
}
