import { Repository } from '../../../../core/interfaces';

import { Plan } from '../entities';

export interface ISubscriptionPlanRepository extends Repository<Plan> {
  getMany(): Promise<Plan[]>;
}
