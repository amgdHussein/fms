import { PaymentGateway } from '../../../../../core/enums';
import { BillingAccount } from '../../../domain';

// TODO: FILL THE DTO
export class BillingAccountDto implements BillingAccount {
  id: string;
  organizationId: string;
  gateway: PaymentGateway;
  credentials: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
