import { SubscriptionStatus } from './subscription-status.enum';

export interface Subscription {
  id: string;
  planId: string; // ID of the plan associated with the subscription
  systemId: string; // ID of the system associated with the subscription

  status: SubscriptionStatus; // Status of the subscription
  autoRenew: boolean; // Whether the subscription should be automatically renewed

  startAt: number; // Timestamp when the subscription started
  endAt: number; // Timestamp when the subscription ends
  billingAt: number; // Timestamp when the subscription will be billed

  createdBy: string; // User who created the user
  createdAt: number; // Timestamp when the user was created
  updatedBy: string; // User who last updated the user
  updatedAt: number; // Timestamp when the user was last updated
}
