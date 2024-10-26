import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { IUserRepository, User } from '../../domain';

@Injectable()
export class UserFirestoreRepository implements IUserRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

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
    // Initiate some fields
    user.createdBy = this.locker.user.uid;
    user.createdAt = Date.now();
    user.updatedBy = this.locker.user.uid;
    user.updatedAt = Date.now();

    return this.db.addDoc(user);
  }

  async set(user: Partial<User> & { id: string }): Promise<User> {
    // Initiate some fields
    user.updatedBy = this.locker.user.uid;
    user.updatedAt = Date.now();

    return this.db.setDoc(user as User);
  }

  async update(user: Partial<User> & { id: string }): Promise<User> {
    // Update some fields
    user.updatedBy = this.locker.user.uid;
    user.updatedAt = Date.now();

    return this.db.updateDoc(user);
  }

  async delete(id: string): Promise<User> {
    return this.db.deleteDoc(id);
  }
}
