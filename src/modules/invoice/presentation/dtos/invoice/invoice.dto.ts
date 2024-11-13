import { Address, Currency } from '../../../../../core/common';
import { PaymentStatus } from '../../../../payment/domain';

import { Invoice, InvoiceDirection, InvoiceForm, InvoiceStatus, InvoiceType, Item } from '../../../domain';

// TODO: FILL THE DTO
export class InvoiceDto implements Invoice {
  id: string;
  organizationId: string;
  profileId: string;
  clientId: string;
  invoiceNumber: string;
  name: string;
  description?: string;
  address?: Address;
  type: InvoiceType;
  form: InvoiceForm;
  direction: InvoiceDirection;
  currency: Currency;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
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
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
