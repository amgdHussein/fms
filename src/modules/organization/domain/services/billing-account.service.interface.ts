import { QueryFilter, QueryOrder } from '../../../../core/queries';
import { BillingAccount } from '../entities';

export interface IBillingAccountService {
  getBillingAccount(id: string): Promise<BillingAccount>;
  getBillingAccounts(organizationId: string, filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<BillingAccount[]>;
  addBillingAccount(account: Partial<BillingAccount> & { organizationId: string }): Promise<BillingAccount>;
  updateBillingAccount(account: Partial<BillingAccount> & { id: string }): Promise<BillingAccount>;
  deleteBillingAccount(id: string): Promise<BillingAccount>;
}
