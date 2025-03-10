import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { ISubscriptionService, Subscription, SUBSCRIPTION_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class CancelSubscription implements Usecase<Subscription> {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE_PROVIDER)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  async execute(id: string): Promise<Subscription> {
    return this.subscriptionService.cancelSubscription(id);
  }
}
