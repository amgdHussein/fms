import { Currency } from '../../../../core/common';
import { PaymentMethod } from './payment-method.enum';

export interface Payment {
  id: string;
  organizationId: string; // Unique ID for the organization

  clientId: string;
  clientName: string;

  category: PaymentCategory;

  entityId: string;
  entityNumber: string;

  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: Currency;

  transactionId: string; // External ID from the payment gateway

  method: PaymentMethod;
  referenceId: string; // Reference ID from the payment gateway

  processedAt: number; // Timestamp when the payment was processed
  paidAt: number; // Timestamp when the payment was paid.

  notes?: string;

  createdBy?: string;
  createdAt?: number;
  updatedBy?: string;
  updatedAt?: number;
}

export enum PaymentCategory {
  INVOICE,
  RECEIPT,
  SUBSCRIPTION,
}

export enum PaymentType {
  INCOME = 0,
  EXPENSE = 1,
}

export enum PaymentStatus {
  PENDING = 0,
  COMPLETED = 1,
  FAILED = 2,
  PARTIALLY_PAID = 3,
  REFUNDED = 4,
}
