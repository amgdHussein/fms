import { Inject, Injectable } from '@nestjs/common';

import { AuthService } from '../../../../core/auth';
import { AUTH_PROVIDER, FIRESTORE_COLLECTION_PROVIDERS } from '../../../../core/constants';
import { FirestoreService } from '../../../../core/providers';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { BillingAccount, IBillingAccountRepository } from '../../domain';

@Injectable()
export class BillingAccountFirestoreRepository implements IBillingAccountRepository {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authService: AuthService,

    @Inject(FIRESTORE_COLLECTION_PROVIDERS.BILLING_ACCOUNTS)
    private readonly db: FirestoreService<BillingAccount>,
  ) {}

  async get(id: string): Promise<BillingAccount> {
    return this.db.getDoc(id);
  }

  async getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<BillingAccount[]> {
    return this.db.getDocs(filters, page, limit, order);
  }

  async add(account: Partial<BillingAccount> & { organizationId: string }): Promise<BillingAccount> {
    // Initiate some fields
    account.createdBy = this.authService.currentUser.uid;
    account.createdAt = Date.now();
    account.updatedBy = this.authService.currentUser.uid;
    account.updatedAt = Date.now();

    return this.db.addDoc(account);
  }

  async update(account: Partial<BillingAccount> & { id: string }): Promise<BillingAccount> {
    // Update some fields
    account.updatedBy = this.authService.currentUser.uid;
    account.updatedAt = Date.now();

    return this.db.updateDoc(account);
  }

  async delete(id: string): Promise<BillingAccount> {
    return this.db.deleteDoc(id);
  }
}
