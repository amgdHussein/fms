import { Repository } from '../../../../core/interfaces';
import { QueryFilter } from '../../../../core/models';

import { OrganizationTax } from '../entities';

export interface IOrganizationTaxRepository extends Repository<OrganizationTax> {
  getMany(filters?: QueryFilter[]): Promise<OrganizationTax[]>;
}
