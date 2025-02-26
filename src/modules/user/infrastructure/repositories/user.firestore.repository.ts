import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { IUserRepository, User } from '../../domain';

@Injectable()
export class UserFirestoreRepository implements IUserRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.USERS)
    private readonly db: FirestoreService<User>,
  ) {}

  async get(id: string): Promise<User> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<User[]> {
    return this.db.getDocs(filters, page, limit, order);
  }

  async add(user: Partial<User>): Promise<User> {
    // Initiate some fields
    user.createdBy = this.authService.currentUser.uid;
    user.createdAt = Date.now();
    user.updatedBy = this.authService.currentUser.uid;
    user.updatedAt = Date.now();

    return this.db.addDoc(user);
  }

  async set(user: Partial<User> & { id: string }): Promise<User> {
    // Initiate some fields
    user.updatedBy = this.authService.currentUser.uid;
    user.updatedAt = Date.now();

    return this.db.setDoc(user as User);
  }

  async update(user: Partial<User> & { id: string }): Promise<User> {
    // Update some fields
    user.updatedBy = this.authService.currentUser.uid;
    user.updatedAt = Date.now();

    return this.db.updateDoc(user);
  }

  async delete(id: string): Promise<User> {
    return this.db.deleteDoc(id);
  }
}
