import { QueryFilter, QueryOrder } from '../../../../core/queries';

import { Subscription } from '../entities';

export interface ISubscriptionService {
  getSubscription(id: string): Promise<Subscription>;
  getSubscriptions(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Subscription[]>;
  addSubscription(subscription: Partial<Subscription> & { organizationId: string; planId: string }): Promise<Subscription>;
  updateSubscription(subscription: Partial<Subscription> & { id: string }): Promise<Subscription>;

  startFreeTrial(organizationId: string): Promise<Subscription>;
  changeSubscriptionPlan(subscription: Partial<Subscription> & { organizationId: string; planId: string }): Promise<Subscription>;
  cancelSubscription(id: string): Promise<Subscription>;
}
