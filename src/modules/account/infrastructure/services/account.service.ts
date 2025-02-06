import { Inject, Injectable } from '@nestjs/common';

import { Account, ACCOUNT_REPOSITORY_PROVIDER, AccountStatus, IAccountRepository, IAccountService } from '../../domain';

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY_PROVIDER)
    private readonly repo: IAccountRepository,
  ) {}

  async getAccount(id: string): Promise<Account> {
    return this.repo.get(id);
  }

  async addAccount(account: Partial<Account> & { userId: string }): Promise<Account> {
    account.startAt = Date.now();
    account.status = AccountStatus.ACTIVE;
    return this.repo.add(account);
  }

  async updateAccount(account: Partial<Account> & { id: string }): Promise<Account> {
    return this.repo.update(account);
  }

  async deleteAccount(id: string): Promise<Account> {
    return this.repo.delete(id);
  }

  async getUserAccounts(userId: string): Promise<Account[]> {
    return this.repo.getMany([{ key: 'userId', operator: 'eq', value: userId }]);
  }

  async getOrganizationAccounts(organizationId: string): Promise<Account[]> {
    return this.repo.getMany([{ key: 'organizationId', operator: 'eq', value: organizationId }]);
  }
}
