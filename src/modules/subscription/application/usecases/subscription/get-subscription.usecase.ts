import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import {
  ISubscriptionService,
  ISubscriptionUsageService,
  Subscription,
  SUBSCRIPTION_SERVICE_PROVIDER,
  SUBSCRIPTION_USAGE_SERVICE_PROVIDER,
} from '../../../domain';

@Injectable()
export class GetSubscription implements Usecase<Subscription> {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE_PROVIDER)
    private readonly subscriptionService: ISubscriptionService,

    @Inject(SUBSCRIPTION_USAGE_SERVICE_PROVIDER)
    private readonly usageService: ISubscriptionUsageService,
  ) {}

  async execute(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionService.getSubscription(id);
    const usage = await this.usageService.getUsage(id);
    subscription.usage = usage;

    return subscription;
  }
}
