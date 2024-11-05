import { Currency } from '../../../../core/common';

import { PaymentMethod } from './payment-method.enum';
import { PaymentStatus } from './payment-status.enum';
import { PaymentType } from './payment-type.enum';

export interface Payment {
  id: string;
  systemId: string; // Unique ID for the organization
  profileId: string; // Unique ID for the client profile
  clientId: string; // Unique ID for the client
  invoiceId: string; // Unique ID for the invoice

  type: PaymentType;
  status: PaymentStatus;
  currency: Currency;
  amount: number;

  method: PaymentMethod;
  transactionId: string; // External ID from the payment gateway

  notes?: string;

  processedAt: number; // Timestamp when the payment was processed
  paidAt: number; // Timestamp when the payment was paid

  createdBy: string; // User who created the payment
  createdAt: number; // Timestamp when the payment was created
  updatedBy: string; // User who last updated the payment
  updatedAt: number; // Timestamp when the payment was last updated
}
