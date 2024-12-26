import { Repository } from '../../../../core/interfaces';
import { QueryFilter } from '../../../../core/models';

import { ClientTax } from '../entities';

export interface IClientTaxRepository extends Repository<ClientTax> {
  getMany(filters?: QueryFilter[]): Promise<ClientTax[]>;
}
