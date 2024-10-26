import { Repository } from '../../../../core/interfaces';
import { QueryFilter } from '../../../../core/models';

import { Account } from '../entities';

export interface IAccountRepository extends Repository<Account> {
  getAll(filters?: QueryFilter[]): Promise<Account[]>;
}
