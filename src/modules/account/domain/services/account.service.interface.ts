import { Account } from '../entities';

export interface IAccountService {
  getAccount(id: string): Promise<Account>;
  addAccount(account: Partial<Account>): Promise<Account>;
  updateAccount(account: Partial<Account> & { id: string }): Promise<Account>;
  deleteAccount(id: string): Promise<Account>;
  getUserAccounts(accountId: string): Promise<Account[]>;
  getOrganizationAccounts(organizationId: string): Promise<Account[]>;
}
