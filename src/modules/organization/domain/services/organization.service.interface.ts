import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';

import { Organization } from '../entities';

export interface IOrganizationService {
  getOrganization(id: string): Promise<Organization>;
  getOrganizations(filters?: QueryFilter[]): Promise<Organization[]>;
  queryOrganizations(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Organization>>;
  addOrganization(organization: Partial<Organization> & { userId: string }): Promise<Organization>;
  updateOrganization(organization: Partial<Organization> & { id: string }): Promise<Organization>;
  deleteOrganization(id: string): Promise<Organization>;
}
