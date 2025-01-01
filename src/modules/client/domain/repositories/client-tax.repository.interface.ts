import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/models';

import { ClientTax } from '../entities';

export interface IClientTaxRepository extends Repository<ClientTax> {
  getMany(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<ClientTax[]>;
}
