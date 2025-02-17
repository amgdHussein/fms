import { PaymentGateway } from '../../../../../core/common';
import { BillingAccount } from '../../../domain';

// TODO: FILL THE DTO
export class BillingAccountDto implements BillingAccount {
  id: string;
  organizationId: string;
  gateway: PaymentGateway;
  credentials: Record<string, string>;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
