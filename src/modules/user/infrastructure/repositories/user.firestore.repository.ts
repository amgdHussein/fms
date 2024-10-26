import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';
import { FirestoreService } from '../../../../core/providers';

import { IUserRepository, User } from '../../domain';

@Injectable()
export class UserFirestoreRepository implements IUserRepository {
  constructor(
    @Inject(FIRESTORE_COLLECTION_PROVIDERS.USERS)
    private readonly db: FirestoreService<User>,
  ) {}

  async get(id: string): Promise<User> {
    return this.db.getDoc(id);
  }

  async getAll(filters?: QueryFilter[]): Promise<User[]> {
    return this.db.getDocs(filters);
  }

  async query(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<User>> {
    return this.db.query(page, limit, filters, order);
  }

  async add(user: Partial<User>): Promise<User> {
    return this.db.addDoc(user);
  }

  async set(user: Partial<User> & { id: string }): Promise<User> {
    return this.db.setDoc(user as User);
  }

  async update(input: Partial<User> & { id: string }): Promise<User> {
    return this.db.updateDoc(input);
  }

  async delete(id: string): Promise<User> {
    return this.db.deleteDoc(id);
  }
}
