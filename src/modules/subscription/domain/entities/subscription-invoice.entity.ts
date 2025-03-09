import { Invoice } from '../../../invoice/domain';

/**
 * @param issuer Mofawtar
 * @param receiver - organization
 * @param organizationId - mofawtar
 * @param clientId - organizationId
 * @param type - Type of the invoice = standard
 * @param form - Form/type of the invoice = invoice
 * @param items - This will be a static list of items for each subscription plan
 * @param logo - Logo of mofawtar organization
 * @param direction - Sent
 */
export interface SubscriptionInvoice extends Omit<Invoice, 'profileId' | 'branchId' | 'tax' | 'items' | 'reference'> {
  subscriptionId: string;
  // mission: Mission; // Type or purpose of the invoice
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
