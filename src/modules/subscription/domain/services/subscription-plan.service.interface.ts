import { Plan } from '../entities';

export interface ISubscriptionPlanService {
  getPlan(id: string): Promise<Plan>;
  getPlans(): Promise<Plan[]>;
  addPlan(plan: Partial<Plan>): Promise<Plan>;
  updatePlan(plan: Partial<Plan> & { id: string }): Promise<Plan>;
}
