import { Usage } from './usage.entity';

export interface Subscription {
  id: string;
  planId: string; // ID of the plan associated with the subscription
  organizationId: string; // ID of the organization associated with the subscription

  status: SubscriptionStatus; // Status of the subscription
  autoRenew?: boolean; // Whether the subscription should be automatically renewed

  startAt: number; // Timestamp when the subscription started
  endAt: number; // Timestamp when the subscription ends
  billingAt: number; // Timestamp when the subscription will be billed

  usage?: Usage[]; // Usage of the subscription

  createdBy: string; // User who created the user
  createdAt: number; // Timestamp when the user was created
  updatedBy: string; // User who last updated the user
  updatedAt: number; // Timestamp when the user was last updated
}

export enum SubscriptionStatus {
  PENDING = 0,
  ACTIVE = 1,
  CANCELED = 2,
  EXPIRED = 3,
}
