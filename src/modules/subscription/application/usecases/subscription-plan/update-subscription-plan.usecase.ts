import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { ISubscriptionPlanService, Plan, SUBSCRIPTION_PLAN_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class UpdatePlan implements Usecase<Plan> {
  constructor(
    @Inject(SUBSCRIPTION_PLAN_SERVICE_PROVIDER)
    private readonly planService: ISubscriptionPlanService,
  ) {}

  async execute(plan: Partial<Plan> & { id: string }): Promise<Plan> {
    return this.planService.updatePlan(plan);
  }
}
