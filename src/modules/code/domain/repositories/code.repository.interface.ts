import { Repository } from '../../../../core/interfaces';
import { QueryFilter } from '../../../../core/models';

import { Code } from '../entities';

export interface ICodeRepository extends Repository<Code> {
  getMany(organizationId: string, filters?: QueryFilter[]): Promise<Code[]>;
  addMany(codes: Partial<Code>[], organizationId: string): Promise<Code[]>;
}
