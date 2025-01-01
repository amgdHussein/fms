import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/models';

import { Code } from '../entities';

export interface ICodeRepository extends Repository<Code> {
  getMany(organizationId: string, filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Code[]>;
  addMany(codes: Partial<Code>[], organizationId: string): Promise<Code[]>;
}
