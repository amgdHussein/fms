import { Inject, Injectable } from '@nestjs/common';

import { FIRESTORE_COLLECTION_PROVIDERS, LOCKER_PROVIDER } from '../../../../core/constants';
import { QueryFilter } from '../../../../core/models';
import { FirestoreService, LockerService } from '../../../../core/providers';

import { Account, AccountStatus, IAccountRepository } from '../../domain';

@Injectable()
export class AccountFirestoreRepository implements IAccountRepository {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.ACCOUNTS)
    private readonly db: FirestoreService<Account>,
  ) {}

  async get(id: string): Promise<Account> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[]): Promise<Account[]> {
    return this.db.getDocs(filters);
  }

  async add(account: Partial<Account>): Promise<Account> {
    // Initiate some fields
    account.status = AccountStatus.ACTIVE;
    account.createdBy = this.locker.user.uid;
    account.createdAt = Date.now();
    account.updatedBy = this.locker.user.uid;
    account.updatedAt = Date.now();

    return this.db.addDoc(account);
  }

  async update(account: Partial<Account> & { id: string }): Promise<Account> {
    // Update some fields
    account.updatedBy = this.locker.user.uid;
    account.updatedAt = Date.now();

    return this.db.updateDoc(account);
  }

  async delete(id: string): Promise<Account> {
    return this.db.deleteDoc(id);
  }
}
