import { PaymentGateway } from '../../../../core/enums';
import { Currency } from '../../../../core/models';

import { Invoice } from '../../../invoice/domain';

import { Receipt } from '../../../receipt/domain';
import { PaymentMethod } from './payment-method.enum';

export interface Payment {
  id: string;
  organizationId: string; // Unique ID for the organization

  clientId: string;
  clientName: string;

  entityType: PaymentEntityType;
  entityIds: string[]; // List of invoices/receipts/subscriptions IDs in the db
  entityNumbers: string[]; // List of invoices/receipts/subscriptions numbers in the db

  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: Currency;

  transactionId: string; // Internal id for the transactions table

  method: PaymentMethod;
  gateway?: PaymentGateway;
  referenceId?: string; // Reference ID from the payment gateway

  processedAt: number; // Timestamp when the payment was processed
  paidAt: number; // Timestamp when the payment was paid.

  notes?: string;

  createdBy?: string;
  createdAt?: number;
  updatedBy?: string;
  updatedAt?: number;
}

export type PaymentEntity = Invoice | Receipt;

export enum PaymentEntityType {
  INVOICE,
  RECEIPT,
  SUBSCRIPTION,
}

export enum PaymentType {
  INCOME = 0,
  EXPENSE = 1,
}

export enum PaymentStatus {
  PROCESSING = 0,
  COMPLETED = 1,
  FAILED = 2,
  PARTIALLY_PAID = 3,
  REFUNDED = 4,
}
