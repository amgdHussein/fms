import { Discount } from '../../../../core/models';
import { Usage } from './usage.entity';

export interface Subscription {
  id: string;
  planId: string; // ID of the plan associated with the subscription
  organizationId: string; // ID of the organization associated with the subscription

  status: SubscriptionStatus; // Status of the subscription

  startAt: number; // Timestamp when the subscription started
  endAt: number; // Timestamp when the subscription ends
  billingAt: number; // Timestamp when the subscription will be billed

  usage?: Usage[]; // Usage of the subscription

  // billingCycle: BillingCycle; //   default: BillingCycle.MONTHLY
  // trialEndDate: Date;
  // paymentStatus: PaymentStatus; //   default: PaymentStatus.UNPAID
  // lastPaymentDate: Date;
  // nextBillingDate: Date;
  // paymentGateway: PaymentGateway;
  // gatewayCustomerId: string;
  // paymentMethodDetails: Record<string, any>;

  // stripePriceId: string;
  // stripeId: string;

  // coupon: SubscriptionCoupon;

  gatewaySubscriptionId: number;
  // paymentMethod: PaymentMethod;
  // paymentGateway: PaymentGateway;

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
  TRIAL = 4,
}

export enum SubscriptionCouponDuration {
  ONCE = 'once',
  REPEATING = 'repeating',
  FOREVER = 'forever',
}

export interface SubscriptionCoupon {
  code: string;
  duration: SubscriptionCouponDuration;
  discount: Discount;
}
