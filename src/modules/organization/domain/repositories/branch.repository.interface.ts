import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { Branch } from '../entities';

export interface IBranchRepository extends Repository<Branch> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Branch[]>;
  addMany(branches: (Partial<Branch> & { organizationId: string })[]): Promise<Branch[]>;
}
