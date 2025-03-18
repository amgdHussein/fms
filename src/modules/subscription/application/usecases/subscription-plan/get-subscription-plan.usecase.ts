import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { ISubscriptionPlanService, Plan, SUBSCRIPTION_PLAN_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class GetPlan implements Usecase<Plan> {
  constructor(
    @Inject(SUBSCRIPTION_PLAN_SERVICE_PROVIDER)
    private readonly planService: ISubscriptionPlanService,
  ) {}

  async execute(id: string): Promise<Plan> {
    return this.planService.getPlan(id);
  }
}
