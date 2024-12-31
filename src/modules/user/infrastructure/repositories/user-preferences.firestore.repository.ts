import { Inject, Injectable } from '@nestjs/common';

import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';

import { AuthService } from '../../../../core/auth';
import { IUserPreferencesRepository, UserPreferences } from '../../domain';

@Injectable()
export class UserPreferencesFirestoreRepository implements IUserPreferencesRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.USERS_PREFERENCES)
    private readonly db: FirestoreService<UserPreferences>,
  ) {}

  async get(id: string): Promise<UserPreferences> {
    return this.db.getDoc(id);
  }

  async add(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    // Initiate some fields
    preferences.createdBy = this.authService.currentUser.uid;
    preferences.createdAt = Date.now();
    preferences.updatedBy = this.authService.currentUser.uid;
    preferences.updatedAt = Date.now();

    return this.db.addDoc(preferences);
  }

  async set(preferences: Partial<UserPreferences> & { id: string }): Promise<UserPreferences> {
    // Initiate some fields
    preferences.createdBy = this.authService.currentUser.uid;
    preferences.createdAt = Date.now();
    preferences.updatedBy = this.authService.currentUser.uid;
    preferences.updatedAt = Date.now();

    return this.db.addDoc(preferences);
  }

  async update(preferences: Partial<UserPreferences> & { id: string }): Promise<UserPreferences> {
    // Update some fields
    preferences.updatedBy = this.authService.currentUser.uid;
    preferences.updatedAt = Date.now();

    return this.db.updateDoc(preferences);
  }

  async delete(id: string): Promise<UserPreferences> {
    return this.db.deleteDoc(id);
  }
}
