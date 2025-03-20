import { Subscription, SubscriptionStatus, Usage } from '../../../domain';

// TODO: FILL THE DTO
export class SubscriptionDto implements Subscription {
  gatewaySubscriptionId: number;
  id: string;
  planId: string;
  organizationId: string;
  status: SubscriptionStatus;
  startAt: number;
  endAt: number;
  billingAt: number;
  usage?: Usage[];
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
