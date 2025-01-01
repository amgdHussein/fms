import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { QueryFilter, QueryOrder } from '../../../../core/models';
import { FirestoreService } from '../../../../core/providers';

import { Account, AccountStatus, IAccountRepository } from '../../domain';

@Injectable()
export class AccountFirestoreRepository implements IAccountRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.ACCOUNTS)
    private readonly db: FirestoreService<Account>,
  ) {}

  async get(id: string): Promise<Account> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Account[]> {
    return this.db.getDocs(filters, page, limit, order);
  }

  async add(account: Partial<Account>): Promise<Account> {
    // Initiate some fields
    account.status = AccountStatus.ACTIVE;
    account.createdBy = this.authService.currentUser.uid;
    account.createdAt = Date.now();
    account.updatedBy = this.authService.currentUser.uid;
    account.updatedAt = Date.now();

    return this.db.addDoc(account);
  }

  async update(account: Partial<Account> & { id: string }): Promise<Account> {
    // Update some fields
    account.updatedBy = this.authService.currentUser.uid;
    account.updatedAt = Date.now();

    return this.db.updateDoc(account);
  }

  async delete(id: string): Promise<Account> {
    return this.db.deleteDoc(id);
  }
}
