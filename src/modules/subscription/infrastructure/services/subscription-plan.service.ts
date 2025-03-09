import { Inject, Injectable } from '@nestjs/common';

import { ISubscriptionPlanRepository, ISubscriptionPlanService, Plan, SUBSCRIPTION_PLAN_REPOSITORY_PROVIDER } from '../../domain';

@Injectable()
export class SubscriptionPlanService implements ISubscriptionPlanService {
  constructor(
    @Inject(SUBSCRIPTION_PLAN_REPOSITORY_PROVIDER)
    private readonly planRepo: ISubscriptionPlanRepository,
  ) {}

  async getPlan(id: string): Promise<Plan> {
    return this.planRepo.get(id);
  }

  async getPlans(): Promise<Plan[]> {
    return this.planRepo.getMany();
  }

  async addPlan(Plan: Partial<Plan> & { id: string }): Promise<Plan> {
    return this.planRepo.add(Plan);
  }

  async updatePlan(Plan: Partial<Plan> & { id: string }): Promise<Plan> {
    return this.planRepo.update(Plan);
  }
}
