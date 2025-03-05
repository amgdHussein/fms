import { PaymentGateway } from '../../../../core/enums';
import { Currency } from '../../../../core/models';

import { Payment, PaymentEntityType, PaymentMethod, PaymentStatus, PaymentType } from '../../domain/entities';

export class PaymentDto implements Payment {
  id: string;
  organizationId: string;
  clientId: string;
  clientName: string;
  entityType: PaymentEntityType;
  entityIds: string[];
  entityNumbers: string[];
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: Currency;
  transactionId: string;
  method: PaymentMethod;
  gateway?: PaymentGateway;
  referenceId?: string;
  processedAt: number;
  paidAt: number;
  notes?: string;
  createdBy?: string;
  createdAt?: number;
  updatedBy?: string;
  updatedAt?: number;
}
