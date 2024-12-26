import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { ClientPreferences, IClientPreferencesRepository } from '../../domain';

@Injectable()
export class ClientPreferencesFirestoreRepository implements IClientPreferencesRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.CLIENTS_PREFERENCES)
    private readonly db: FirestoreService<ClientPreferences>,
  ) {}

  async get(id: string): Promise<ClientPreferences> {
    return this.db.getDoc(id);
  }

  async add(preferences: Partial<ClientPreferences> & { clientId: string }): Promise<ClientPreferences> {
    // Initiate some fields
    preferences.createdBy = this.locker.user.uid;
    preferences.createdAt = Date.now();
    preferences.updatedBy = this.locker.user.uid;
    preferences.updatedAt = Date.now();

    return this.db.addDoc(preferences);
  }

  async update(preferences: Partial<ClientPreferences> & { id: string }): Promise<ClientPreferences> {
    // Update some fields
    preferences.updatedBy = this.locker.user.uid;
    preferences.updatedAt = Date.now();

    return this.db.updateDoc(preferences);
  }

  async delete(id: string): Promise<ClientPreferences> {
    return this.db.deleteDoc(id);
  }
}
