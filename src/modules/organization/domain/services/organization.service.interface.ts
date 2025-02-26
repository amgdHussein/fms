import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { Organization } from '../entities';

export interface IOrganizationService {
  getOrganization(id: string): Promise<Organization>;
  getOrganizations(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Organization[]>;
  addOrganization(organization: Partial<Organization> & { userId: string }): Promise<Organization>;
  updateOrganization(organization: Partial<Organization> & { id: string }): Promise<Organization>;
  deleteOrganization(id: string): Promise<Organization>;
}
