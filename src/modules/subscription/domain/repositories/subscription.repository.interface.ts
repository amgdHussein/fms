import { Repository } from '../../../../core/interfaces';
import { QueryFilter } from '../../../../core/queries';

import { Subscription } from '../entities';

export interface ISubscriptionRepository extends Repository<Subscription> {
  getMany(filters?: QueryFilter[]): Promise<Subscription[]>;
}
