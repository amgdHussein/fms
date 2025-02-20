import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';

import { IOrganizationPreferencesRepository, OrganizationPreferences } from '../../domain';

@Injectable()
export class OrganizationPreferencesFirestoreRepository implements IOrganizationPreferencesRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.ORGANIZATIONS_PREFERENCES)
    private readonly db: FirestoreService<OrganizationPreferences>,
  ) {}

  async get(id: string): Promise<OrganizationPreferences> {
    return this.db.getDoc(id);
  }

  async add(preferences: OrganizationPreferences): Promise<OrganizationPreferences> {
    // Initiate some fields
    preferences.createdBy = this.authService.currentUser.uid;
    preferences.createdAt = Date.now();
    preferences.updatedBy = this.authService.currentUser.uid;
    preferences.updatedAt = Date.now();

    return this.db.setDoc(preferences); //TODO: I MAKE THIS SET
  }

  async set(preferences: OrganizationPreferences): Promise<OrganizationPreferences> {
    // Initiate some fields
    preferences.createdBy = this.authService.currentUser.uid;
    preferences.createdAt = Date.now();
    preferences.updatedBy = this.authService.currentUser.uid;
    preferences.updatedAt = Date.now();

    return this.db.setDoc(preferences);
  }

  async update(preferences: Partial<OrganizationPreferences> & { id: string }): Promise<OrganizationPreferences> {
    // Update some fields
    preferences.updatedBy = this.authService.currentUser.uid;
    preferences.updatedAt = Date.now();

    return this.db.updateDoc(preferences);
  }

  async delete(id: string): Promise<OrganizationPreferences> {
    return this.db.deleteDoc(id);
  }
}
