import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { OrganizationTax } from '../entities';

export interface IOrganizationTaxRepository extends Repository<OrganizationTax> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<OrganizationTax[]>;
}
