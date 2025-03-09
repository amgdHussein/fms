import { Inject, Injectable } from '@nestjs/common';

import { QueryFilter, QueryOrder } from '../../../../core/queries';
import { ISubscriptionRepository, ISubscriptionService, Subscription, SUBSCRIPTION_REPOSITORY_PROVIDER, SubscriptionStatus } from '../../domain';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY_PROVIDER)
    private readonly subscriptionRepo: ISubscriptionRepository,
  ) {}

  async getSubscription(id: string): Promise<Subscription> {
    return this.subscriptionRepo.get(id);
  }

  async getSubscriptions(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Subscription[]> {
    return this.subscriptionRepo.getMany(filters, page, limit, order);
  }

  async addSubscription(subscription: Partial<Subscription> & { id: string }): Promise<Subscription> {
    return this.subscriptionRepo.add(subscription);
  }

  async updateSubscription(subscription: Partial<Subscription> & { id: string }): Promise<Subscription> {
    return this.subscriptionRepo.update(subscription);
  }

  async activateSubscription(id: string): Promise<Subscription> {
    return this.subscriptionRepo.update({
      id,
      status: SubscriptionStatus.ACTIVE,
    });
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    return this.subscriptionRepo.update({
      id,
      status: SubscriptionStatus.CANCELED,
    });
  }
}
