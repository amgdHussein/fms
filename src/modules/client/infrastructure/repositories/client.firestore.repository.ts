import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { Client, IClientRepository } from '../../domain';

@Injectable()
export class ClientFirestoreRepository implements IClientRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.CLIENTS)
    private readonly db: FirestoreService<Client>,
  ) {}

  async get(id: string): Promise<Client> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[]): Promise<Client[]> {
    return this.db.getDocs(filters);
  }

  async query(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Client>> {
    return this.db.query(page, limit, filters, order);
  }

  async add(client: Partial<Client>): Promise<Client> {
    // Initiate some fields
    client.createdBy = this.locker.user.name;
    client.createdAt = Date.now();
    client.updatedBy = this.locker.user.name;
    client.updatedAt = Date.now();

    return this.db.addDoc(client);
  }

  async addMany(clients: Partial<Client>[]): Promise<Client[]> {
    // Update some fields
    const userId = this.locker.user.uid;
    const now = Date.now();

    clients.forEach(client => {
      client.updatedBy = userId;
      client.updatedAt = now;
    });

    return this.db.addDocs(clients);
  }

  async update(client: Partial<Client> & { id: string }): Promise<Client> {
    // Update some fields
    client.updatedBy = this.locker.user.name;
    client.updatedAt = Date.now();

    return this.db.updateDoc(client);
  }

  async delete(id: string): Promise<Client> {
    return this.db.deleteDoc(id);
  }
}
