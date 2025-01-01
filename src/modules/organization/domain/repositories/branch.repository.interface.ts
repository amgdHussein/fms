import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/models';

import { OrganizationBranch } from '../entities';

export interface IOrganizationBranchRepository extends Repository<OrganizationBranch> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<OrganizationBranch[]>;
}
