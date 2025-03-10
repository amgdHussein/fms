import { Address, Currency, Issuer, Photo, Receiver } from '../../../../../core/models';

import { Invoice, InvoiceDirection, InvoiceForm, InvoiceStatus, InvoiceType, Item } from '../../../domain';

// TODO: FILL THE DTO
export class InvoiceDto implements Invoice {
  id: string;
  organizationId: string;
  clientId: string;

  branchId?: string;
  profileId?: string;

  issuer: Issuer; // The user who issued the receipt
  receiver: Receiver; // The user who issued the receipt

  invoiceNumber: string;
  // name: string;
  // description?: string;
  address?: Address;
  type: InvoiceType;
  form: InvoiceForm;
  direction: InvoiceDirection;
  currency: Currency;
  status: InvoiceStatus;
  paymentId: string;
  discount: number;
  additionalDiscount?: number;
  tax: number;
  grossAmount: number;
  netAmount: number;
  paidAmount?: number;
  totalAmount: number;
  notes?: string;
  items?: Item[];
  reference?: string[];
  issuedAt: number;
  dueAt?: number;

  logo?: Photo;

  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
