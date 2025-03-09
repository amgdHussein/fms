import { Repository } from '../../../../core/interfaces';

import { Usage } from '../entities';

export interface ISubscriptionUsageRepository extends Repository<Usage> {
  getMany(subscriptionId: string): Promise<Usage[]>;
  addMany(usage: Partial<Usage>[], subscriptionId: string): Promise<Usage[]>;
}
