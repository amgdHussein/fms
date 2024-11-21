import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';

import { Organization } from '../entities';

export interface IOrganizationRepository extends Repository<Organization> {
  getMany(filters?: QueryFilter[]): Promise<Organization[]>;
  query(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Organization>>;
}
