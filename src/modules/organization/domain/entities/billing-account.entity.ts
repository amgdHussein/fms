import { PaymentGateway } from '../../../../core/enums';

export interface BillingAccount {
  id: string;
  organizationId: string;
  gateway: PaymentGateway;
  credentials: string; // Encrypted credentials

  isEnabled: boolean; // If the billing account is enabled

  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
