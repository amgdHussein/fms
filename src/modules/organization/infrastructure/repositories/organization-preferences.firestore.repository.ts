import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { IOrganizationPreferencesRepository, OrganizationPreferences } from '../../domain';

@Injectable()
export class OrganizationPreferencesFirestoreRepository implements IOrganizationPreferencesRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.ORGANIZATIONS_PREFERENCES)
    private readonly db: FirestoreService<OrganizationPreferences>,
  ) {}

  async get(id: string): Promise<OrganizationPreferences> {
    return this.db.getDoc(id);
  }

  async add(preferences: Partial<OrganizationPreferences> & { systemId: string }): Promise<OrganizationPreferences> {
    // Initiate some fields
    preferences.createdBy = this.locker.user.uid;
    preferences.createdAt = Date.now();
    preferences.updatedBy = this.locker.user.uid;
    preferences.updatedAt = Date.now();

    return this.db.addDoc(preferences);
  }

  async update(preferences: Partial<OrganizationPreferences> & { id: string }): Promise<OrganizationPreferences> {
    // Update some fields
    preferences.updatedBy = this.locker.user.uid;
    preferences.updatedAt = Date.now();

    return this.db.updateDoc(preferences);
  }

  async delete(id: string): Promise<OrganizationPreferences> {
    return this.db.deleteDoc(id);
  }
}
