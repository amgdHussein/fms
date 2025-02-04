import { Address, Authority, Currency, Phone } from '../../../../core/common';
import { IssuerType } from '../../../../core/providers';

import { PaymentStatus } from '../../../payment/domain/entities';

import { InvoiceDirection } from './invoice-direction.enum';
import { InvoiceForm } from './invoice-form.enum';
import { InvoiceStatus, TaxInvoiceStatus } from './invoice-status.enum';
import { InvoiceType } from './invoice-type.enum';
import { Item } from './item.entity';

export interface Invoice {
  id: string;
  organizationId: string; // Unique ID for the organization
  branchId: string; // Organization branch ID
  clientId: string; // ID of the client
  profileId: string; // ID of the client profile

  sender: Sender; // The user who issued the receipt
  receiver: Receiver; // The user who issued the receipt

  invoiceNumber: string; // Next incrementing number for the invoice (organization specific)

  name: string; // Name of the invoice
  description?: string; // Description of the invoice

  type: InvoiceType; // Nature of the invoice (e.g., standard, tax)
  form: InvoiceForm; // Form/type of the invoice (e.g., credit, debit)
  direction: InvoiceDirection;

  currency: Currency; // Currency of the invoice
  status: InvoiceStatus; // Status of the invoice
  paymentStatus: PaymentStatus; // Payment status of the invoice

  discount: number; // ? discountsTotal // The total discount applied
  additionalDiscount?: number; // ? extraDiscountAmount // Any additional discount applied
  tax: number; // The total tax applied

  grossAmount: number; // ? amount // The total cost of all products or services before taxes and discounts
  netAmount: number; // ? netTotal // The total cost after discounts but before taxes
  paidAmount?: number; // ? totalAmountPaid // The amount that has been paid
  totalAmount: number; // The total cost after discounts and taxes

  notes?: string; // Notes or comments related to the invoice
  items?: Item[]; // This will contain the child lines
  reference?: string[]; // A reference id list associated with the old invoices incase debit or credit (team-member manually select them)

  issuedAt: number; // Timestamp when the invoice was issued
  dueAt?: number; // Timestamp when the invoice is due

  createdBy: string; // User who created the invoice
  createdAt: number; // Timestamp when the invoice was created
  updatedBy: string; // User who last updated the invoice
  updatedAt: number; // Timestamp when the invoice was last updated
}

export interface TaxInvoice extends Invoice {
  authority: Authority; // Tax authority data for that invoice
  uuid: string; // Authority invoice uuid
  taxStatus: TaxInvoiceStatus;
  url: string; // Tax invoice public URL
  activityCode: string; // Tax activity code
  deliveryAt?: number; // ? serviceDeliveryDate // Tax invoice delivery date with only export invoices
  uuidReferences: string[]; // List of uuid references for the invoice
  reason?: string;
}

export interface Sender {
  name: string;
  address: Address;
  taxId?: string;
  commercialRegistryNo?: string;
  email?: string;
  phone?: Phone;
}

export interface Receiver {
  name: string;
  address: Address;
  taxId?: string;
  type?: IssuerType;
  email?: string;
  phone?: Phone;
}
