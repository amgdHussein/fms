import { PaymentGateway } from '../../../../core/enums';

export interface BillingAccount {
  id: string;
  organizationId: string;
  gateway: PaymentGateway;
  credentials: string; // Encrypted credentials

  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
