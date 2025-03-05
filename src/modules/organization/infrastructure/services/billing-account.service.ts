import { Inject, Injectable } from '@nestjs/common';

import { QueryFilter, QueryOrder } from '../../../../core/queries';
import { BillingAccount, BRANCH_REPOSITORY_PROVIDER, IBillingAccountRepository, IBillingAccountService } from '../../domain';

@Injectable()
export class BillingAccountService implements IBillingAccountService {
  constructor(
    @Inject(BRANCH_REPOSITORY_PROVIDER)
    private readonly repo: IBillingAccountRepository,
  ) {}

  async getBillingAccount(id: string): Promise<BillingAccount> {
    return this.repo.get(id);
  }

  async getBillingAccounts(organizationId: string, filters: QueryFilter[] = [], page?: number, limit?: number, order?: QueryOrder): Promise<BillingAccount[]> {
    return this.repo.getMany([{ key: 'organizationId', operator: 'eq', value: organizationId }, ...filters], page, limit, order);
  }

  async addBillingAccount(account: Partial<BillingAccount> & { organizationId: string }): Promise<BillingAccount> {
    // TODO: ENCRYPT THE CREDENTIALS
    return this.repo.add(account);
  }

  async updateBillingAccount(account: Partial<BillingAccount> & { id: string }): Promise<BillingAccount> {
    return this.repo.update(account);
  }

  async deleteBillingAccount(id: string): Promise<BillingAccount> {
    return this.repo.delete(id);
  }
}
