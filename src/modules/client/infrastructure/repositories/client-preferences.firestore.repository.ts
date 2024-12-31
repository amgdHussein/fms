import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';

import { ClientPreferences, IClientPreferencesRepository } from '../../domain';

@Injectable()
export class ClientPreferencesFirestoreRepository implements IClientPreferencesRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.CLIENTS_PREFERENCES)
    private readonly db: FirestoreService<ClientPreferences>,
  ) {}

  async get(id: string): Promise<ClientPreferences> {
    return this.db.getDoc(id);
  }

  async add(preferences: Partial<ClientPreferences> & { clientId: string }): Promise<ClientPreferences> {
    // Initiate some fields
    preferences.createdBy = this.authService.currentUser.uid;
    preferences.createdAt = Date.now();
    preferences.updatedBy = this.authService.currentUser.uid;
    preferences.updatedAt = Date.now();

    return this.db.addDoc(preferences);
  }

  async update(preferences: Partial<ClientPreferences> & { id: string }): Promise<ClientPreferences> {
    // Update some fields
    preferences.updatedBy = this.authService.currentUser.uid;
    preferences.updatedAt = Date.now();

    return this.db.updateDoc(preferences);
  }

  async delete(id: string): Promise<ClientPreferences> {
    return this.db.deleteDoc(id);
  }
}
