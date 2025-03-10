import { CurrencyCode, Cycle } from '../../../../../core/enums';
import { Plan } from '../../../domain';

// TODO: FILL THE DTO
export class PlanDto implements Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  cycle: Cycle;
  currency: CurrencyCode;
  maxMembers: number;
  maxClients: number;
  maxSubmissions: number;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
