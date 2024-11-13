import { Currency } from '../../../../core/common';

import { InvoiceStatus } from '../../../invoice/domain';
import { PaymentStatus } from '../../../payment/domain';

export interface SubscriptionInvoice {
  id: string;
  organizationId: string; // Unique ID for the organization
  subscriptionId: string; // ID of the subscription associated with the invoice

  name: string; // Name of the invoice
  description?: string; // Description of the invoice

  currency: Currency; // Currency of the invoice
  mission: Mission; // Type or purpose of the invoice
  status: InvoiceStatus; // Status of the invoice
  paymentStatus: PaymentStatus; // Payment status of the invoice

  discount?: number; // Discount applied to the invoice
  tax?: number; // The total tax applied

  grossAmount: number; // The total cost of all products or services before taxes and discounts
  netAmount: number; // The total cost after discounts but before taxes
  totalAmount: number; // The total cost after discounts and taxes

  notes?: string; // Notes or comments related to the invoice

  issuedAt: number; // Timestamp when the invoice was issued
  dueAt: number; // Timestamp when the invoice is due

  createdBy: string; // User who created the invoice
  createdAt: number; // Timestamp when the invoice was created
  updatedBy: string; // User who last updated the invoice
  updatedAt: number; // Timestamp when the invoice was last updated
}

export enum Mission {
  NEW_SUBSCRIPTION = 'New Subscription',
  RENEWAL = 'Renewal',
  UPGRADE = 'Upgrade',
  DOWNGRADE = 'Downgrade',
  ONE_TIME_PURCHASE = 'One-time Purchase',
  ADD_ON_SERVICE = 'Add-on Service',
  CANCELLATION_FEE = 'Cancellation Fee',
  LATE_FEE = 'Late Fee',
  OTHER = 'Other',
}
