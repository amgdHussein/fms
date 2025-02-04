import { Address, Currency } from '../../../../../core/common';
import { PaymentStatus } from '../../../../payment/domain';

import { Invoice, InvoiceDirection, InvoiceForm, InvoiceStatus, InvoiceType, Item } from '../../../domain';
import { Receiver, Sender } from '../../../domain/entities/invoice.entity';

// TODO: FILL THE DTO
export class InvoiceDto implements Invoice {
  id: string;
  organizationId: string;
  branchId: string;
  profileId: string;
  clientId: string;
  sender: Sender; // The user who issued the receipt
  receiver: Receiver; // The user who issued the receipt

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
