import { Inject, Injectable } from '@nestjs/common';

import * as moment from 'moment-timezone';

import { Cycle } from '../../../../core/enums';

import {
  ISubscriptionPlanService,
  ISubscriptionService,
  SUBSCRIPTION_PLAN_SERVICE_PROVIDER,
  SUBSCRIPTION_SERVICE_PROVIDER,
  SubscriptionStatus,
} from '../../domain';

@Injectable()
export class SubscriptionCronManager {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE_PROVIDER)
    private readonly subscriptionService: ISubscriptionService,

    @Inject(SUBSCRIPTION_PLAN_SERVICE_PROVIDER)
    private readonly planService: ISubscriptionPlanService,
  ) {}

  async handlerSubscriptionExpiry(): Promise<void> {
    const subscriptions = await this.subscriptionService.getSubscriptions([
      {
        key: 'status',
        operator: 'eq',
        value: SubscriptionStatus.ACTIVE,
      },
      {
        key: 'autoRenew',
        operator: 'eq',
        value: false,
      },
    ]);

    if (!subscriptions.length) return;

    const plans = await this.planService.getPlans();

    for (const subscription of subscriptions) {
      const plan = plans.find(plan => plan.id === subscription.planId);
      const cycle = plan.cycle;
      const days = cycle == Cycle.WEEKLY ? 7 : cycle == Cycle.MONTHLY ? 30 : 365;

      const endDate = moment(subscription.startAt).add(days, 'days').valueOf();
      if (endDate < Date.now()) {
        await this.subscriptionService.updateSubscription({
          id: subscription.id,
          status: SubscriptionStatus.EXPIRED,
          endAt: endDate,
        });
      }
    }
  }
}
