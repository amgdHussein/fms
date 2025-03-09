import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { Subscription } from '../entities';

export interface ISubscriptionRepository extends Repository<Subscription> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Subscription[]>;
}
