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
export class GetOrganizationSubscription implements Usecase<Subscription> {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE_PROVIDER)
    private readonly subscriptionService: ISubscriptionService,

    @Inject(SUBSCRIPTION_USAGE_SERVICE_PROVIDER)
    private readonly usageService: ISubscriptionUsageService,
  ) {}

  async execute(organizationId: string): Promise<Subscription> {
    const [subscription] = await this.subscriptionService.getSubscriptions([{ key: 'organizationId', operator: 'eq', value: organizationId }], 1, 1, {
      key: 'startAt',
      dir: 'desc',
    });

    const usage = await this.usageService.getUsage(subscription.id);
    subscription.usage = usage;

    return subscription;
  }
}
