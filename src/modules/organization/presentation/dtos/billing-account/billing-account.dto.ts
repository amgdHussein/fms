import { PaymentGateway } from '../../../../../core/enums';
import { BillingAccount } from '../../../domain';

// TODO: FILL THE DTO
export class BillingAccountDto implements BillingAccount {
  id: string;
  organizationId: string;
  gateway: PaymentGateway;
  credentials: string;

  isEnabled: boolean; // If the billing account is enabled

  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
