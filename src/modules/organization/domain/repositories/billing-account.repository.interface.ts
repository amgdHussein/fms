import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/models';

import { BillingAccount } from '../entities';

export interface IBillingAccountRepository extends Repository<BillingAccount> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<BillingAccount[]>;
}
