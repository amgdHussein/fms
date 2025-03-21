import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { Client, IClientRepository } from '../../domain';

@Injectable()
export class ClientFirestoreRepository implements IClientRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.CLIENTS)
    private readonly db: FirestoreService<Client>,
  ) {}

  async get(id: string): Promise<Client> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Client[]> {
    return this.db.getDocs(filters, page, limit, order);
  }

  async add(client: Partial<Client>): Promise<Client> {
    // Initiate some fields
    client.createdBy = this.authService.currentUser.uid;
    client.createdAt = Date.now();
    client.updatedBy = this.authService.currentUser.uid;
    client.updatedAt = Date.now();

    return this.db.addDoc(client);
  }

  async addMany(clients: Partial<Client>[]): Promise<Client[]> {
    // Update some fields
    const userId = this.authService.currentUser.uid;
    const now = Date.now();

    clients.forEach(client => {
      client.updatedBy = userId;
      client.updatedAt = now;
    });

    return this.db.addDocs(clients);
  }

  async update(client: Partial<Client> & { id: string }): Promise<Client> {
    // Update some fields
    client.updatedBy = this.authService.currentUser.uid;
    client.updatedAt = Date.now();

    return this.db.updateDoc(client);
  }

  async delete(id: string): Promise<Client> {
    return this.db.deleteDoc(id);
  }
}
