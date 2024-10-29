import { Repository } from '../../../../core/interfaces';
import { QueryFilter } from '../../../../core/models';

import { Product } from '../entities';

export interface IOrganizationProductRepository extends Repository<Product> {
  getMany(organizationId: string, filters?: QueryFilter[]): Promise<Product[]>;
}
