import { Plan } from '../entities';

export interface ISubscriptionPlanService {
  getPlan(id: string): Promise<Plan>;
  getPlans(): Promise<Plan[]>;
  addPlan(Plan: Partial<Plan> & { id: string }): Promise<Plan>;
  updatePlan(Plan: Partial<Plan> & { id: string }): Promise<Plan>;
}
