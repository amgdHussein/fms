import { QueryFilter } from '../../../../core/queries';

import { Subscription } from '../entities';

export interface ISubscriptionService {
  getSubscription(id: string): Promise<Subscription>;
  getSubscriptions(filters?: QueryFilter[]): Promise<Subscription[]>;
  addSubscription(subscription: Partial<Subscription> & { id: string }): Promise<Subscription>;
  updateSubscription(subscription: Partial<Subscription> & { id: string }): Promise<Subscription>;
  cancelSubscription(id: string): Promise<Subscription>;
  isSubscriptionActive(id: string): Promise<boolean>;
}
