import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { ISubscriptionService, Subscription, SUBSCRIPTION_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class ChangeSubscriptionPlan implements Usecase<Subscription> {
  constructor(
    @Inject(SUBSCRIPTION_SERVICE_PROVIDER)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  async execute(subscription: Partial<Subscription> & { organizationId: string; planId: string }): Promise<Subscription> {
    return await this.subscriptionService.changeSubscriptionPlan(subscription);
  }
}
