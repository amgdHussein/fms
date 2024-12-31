import { Repository } from '../../../../core/interfaces';
import { QueryFilter } from '../../../../core/models';

import { Event } from '../entities';

export interface IEventRepository extends Repository<Event> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number): Promise<Event[]>;
}
