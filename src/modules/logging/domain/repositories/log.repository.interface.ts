import { Repository } from '../../../../core/interfaces';
import { QueryFilter } from '../../../../core/models';

import { Log } from '../entities';

export interface ILogRepository extends Repository<Log> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number): Promise<Log[]>;
}
