import { CurrencyCode, Cycle } from '../../../../../core/enums';
import { Plan } from '../../../domain';

// TODO: FILL THE DTO
export class PlanDto implements Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  cycle: Cycle.MONTHLY | Cycle.YEARLY; //TODO: Change this to Cycle enum fro plan only
  currency: CurrencyCode;
  maxMembers: number;
  maxClients: number;
  maxBranches: number;
  maxSubmissions: number;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
