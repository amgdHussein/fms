import { Phone } from '../../../../core/common';
import { IssuerType } from '../../../../core/providers';

export interface Receipt {
  id: string;
  organizationId: string; // Unique ID for the organization
  branchId: string; // Organization branch ID
  clientId: string; // ID of the client

  issuer: ReceiptIssuer; // The user who issued the receipt
  receiver: ReceiptReceiver; // The user who issued the receipt

  receiptNumber: string; // Next incrementing number for the receipt (organization specific)

  type: ReceiptType; // Nature of the receipt (e.g., sales, return)
  // form: InvoiceForm; // Form/type of the receipt (e.g., credit, debit)
  direction: ReceiptDirection;

  currency: ReceiptCurrency; // Currency of the receipt
  status: ReceiptStatus; // Status of the receipt
  // paymentStatus: PaymentStatus; // Payment status of the receipt

  discount: number; // ? discountsTotal // The total discount applied
  additionalDiscount?: number; // ? extraDiscountAmount // Any additional discount applied
  tax: number; // The total tax applied

  grossAmount: number; // ? amount // The total cost of all products or services before taxes and discounts
  netAmount: number; // ? netTotal // The total cost after discounts but before taxes
  paidAmount: number; // ? totalAmountPaid // The amount that has been paid
  totalAmount: number; // The total cost after discounts and taxes

  notes?: string; // Notes or comments related to the receipt
  items?: ReceiptItem[]; // This will contain the child lines
  reference?: string; // A reference id list associated with the old receipts incase debit or credit (team-member manually select them)

  issuedAt: number; // Timestamp when the receipt was issued

  createdBy?: string; // User who created the receipt
  createdAt?: number; // Timestamp when the receipt was created
  updatedBy?: string; // User who last updated the receipt
  updatedAt?: number; // Timestamp when the receipt was last updated

  authority: Authority; // Tax authority data for that receipt
  posId: string; // POS device data for that receipt
  uuid: string; // Authority receipt uuid
  submissionUuid?: string; // Authority submission uuid
  taxStatus: TaxInvoiceStatus;
  errorReasons?: string[]; // List of error reasons if the receipt was rejected
  rejectedSubmission?: any; // The rejected submission object
  url: string; // Tax receipt public URL
  activityCode: string; // Tax activity code
  uuidReference?: string; // uuid references for the receipt
}

export enum Authority {
  ETA = 'eta',
}

export interface ReceiptIssuer {
  name: string;
  taxId: string;
  address: ReceiverAddress;
  email?: string;
  phone?: Phone;
}

export interface ReceiverAddress {
  country: string; // Country name
  street: string; // Primary street address
  city?: string; // City name
  governorate?: string; // State or province or governorate name
  postalCode?: string; // Postal or ZIP code
}

export interface ReceiptReceiver {
  name: string;
  taxId: string;
  address: ReceiverAddress;
  type: IssuerType;
  email?: string;
  phone?: Phone;
}

export interface ReceiptItem {
  id: string;
  organizationId: string; // Unique ID for the organization
  clientId: string; // Unique ID for the client
  // receiptId: string; // Unique ID for the receipt
  productId: string; // Unique ID for the organization product
  codeId: string; // Unique ID for the tax code

  name: string; // Name of the product
  description?: string; // Description of the product
  nameAr?: string; // Arabic name of the product
  descriptionAr?: string; // Description of the product
  category: string; // Category of the product (UI for filtering products)

  unitPrice: number; // Price per unit of the product
  unitType: string; // Type of the unit (car, kilogram, man, ...)
  quantity: number; // Quantity of the item
  discount?: NewDiscount; // Discount applied to the product

  grossAmount: number; // ? amount // The total cost of all products before taxes and discounts
  netAmount: number; // ? netTotal // The total cost after discounts but before taxes
  totalAmount: number; // The total cost after discounts and taxes

  taxes?: ItemTax[]; // To apply each kind of tax-type on the receipt items
  taxDiscount?: NewDiscount; // Value not rate (value that discounted from item before calc line amount)
  profitOrLoss?: number; // The difference in value when selling goods already taxed, indicating profit or loss, e.g., +200 EGP if sold for more, -100 EGP if sold for less

  createdBy: string; // User who created the product
  createdAt: number; // Timestamp when the product was created
  updatedBy: string; // User who last updated the product
  updatedAt: number; // Timestamp when the product was last updated
}

export interface ItemTax {
  taxType: string;
  subType?: string;
  type: 'fixed' | 'percentage';
  value: number;
}

export enum ReceiptType {
  SALE = 's',
  RETURN_RECEIPT = 'r',
  RETURN_WITHOUT_REFERENCE = 'RWR',

  // COFFEE_AND_RESTAURANT = 'SC',
  // RETURN_COFFEE_AND_RESTAURANT = 'RC',

  // GENERAL_SERVICE = 'SS',
  // RETURN_GENERAL_SERVICE = 'RS',

  // RETAIL = 'SR',
  // RETURN_RETAIL = 'RR',

  // TRANSPORTATION = 'ST',
  // RETURN_TRANSPORTATION = 'RT',

  // BANKING = 'SB',
  // RETURN_BANKING = 'RB',

  // EDUCATION = 'SE',
  // RETURN_EDUCATION = 'RE',

  // PROFESSIONAL = 'SP',
  // RETURN_PROFESSIONAL = 'RP',

  // SHIPPING = 'SH',
  // RETURN_SHIPPING = 'RH',

  // ENTERTAINMENT = 'SN',
  // RETURN_ENTERTAINMENT = 'RN',

  // UTILITY = 'SU',
  // RETURN_UTILITY = 'RU',
}

export enum ReceiptDirection {
  RECEIVED = 'received',
  SUBMITTED = 'submitted',
}

export interface ReceiptCurrency {
  code: string;
  rate: number;
}

export enum ReceiptStatus {
  DRAFT = 0,
  ISSUED = 1,
  SENT = 2, // The invoice has been sent to the customer but not yet confirmed.
  VIEWED = 3, // The customer has opened or viewed the invoice.
  OVERDUE = 4,
  PAID = 5,
  PARTIALLY_PAID = 6,
  REFUNDED = 7, // A refund has been issued for the invoice.
  ARCHIVED = 8, // The invoice is archived and no longer active.
}

export enum TaxInvoiceStatus {
  INITIAL = 0,
  PROCESSING = 1,
  SIGNING = 2,
  SIGNED = 3,
  SUBMITTED = 4,
  FAILED = 5,
  REJECTED = 6,
  ACCEPTED = 7,
  CANCELLED = 8,
}

export interface NewDiscount {
  type: 'fixed' | 'percentage';
  value: number;
}
