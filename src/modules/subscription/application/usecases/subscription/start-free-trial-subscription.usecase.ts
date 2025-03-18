import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { ISubscriptionService, Subscription, SUBSCRIPTION_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class StartFreeTrialSubscription implements Usecase<Subscription> {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE_PROVIDER)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  async execute(organizationId: string): Promise<Subscription> {
    return this.subscriptionService.startFreeTrial(organizationId);
  }
}
