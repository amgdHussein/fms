import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { Product } from '../entities';

export interface IOrganizationProductRepository extends Repository<Product> {
  getMany(organizationId: string, filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Product[]>;
}
