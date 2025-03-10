import { Subscription, SubscriptionStatus, Usage } from '../../../domain';

// TODO: FILL THE DTO
export class SubscriptionDto implements Subscription {
  id: string;
  planId: string;
  organizationId: string;
  status: SubscriptionStatus;
  autoRenew?: boolean;
  startAt: number;
  endAt: number;
  billingAt: number;
  usage?: Usage[];
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
