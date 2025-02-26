import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { Event } from '../entities';

export interface IEventRepository extends Repository<Event> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Event[]>;
}
