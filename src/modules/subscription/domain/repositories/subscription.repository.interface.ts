import { Repository } from '../../../../core/interfaces';
import { QueryFilter } from '../../../../core/models';

import { Subscription } from '../entities';

export interface ISubscriptionRepository extends Repository<Subscription> {
  getMany(filters?: QueryFilter[]): Promise<Subscription[]>;
}
