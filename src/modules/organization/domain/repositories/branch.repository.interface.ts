import { Repository } from '../../../../core/interfaces';
import { QueryFilter } from '../../../../core/models';

import { OrganizationBranch } from '../entities';

export interface IOrganizationBranchRepository extends Repository<OrganizationBranch> {
  getMany(filters?: QueryFilter[]): Promise<OrganizationBranch[]>;
}
