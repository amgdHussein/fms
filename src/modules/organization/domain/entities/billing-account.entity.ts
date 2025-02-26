import { PaymentGateway } from '../../../../core/enums';

export interface BillingAccount {
  id: string;
  organizationId: string;
  gateway: PaymentGateway;
  credentials: Record<string, string>; // Stores credentials safely

  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
