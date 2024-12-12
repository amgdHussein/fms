import { Delivery } from './delivery.entity';
import { Issuer } from './issuer.entity';
import { EtaPayment } from './payment.entity';
import { EtaSignature } from './signature.entity';

export interface EtaInvoice {
  submissionUUID?: string;
  dateTimeReceived?: string;
  // validationResults?: DocumentValidationResults;
  validationResults?: {
    status?: ValidationStatus;
    validationSteps?: {
      status?: ValidationStatus;
      error?: ErrorResponse; // object of errors
      stepName?: string;
      stepId?: string;
    }[];
  };
  transformationStatus?: TransformationStatus;
  status?: DocumentFullStatus;
  cancelRequestDate?: string;
  rejectRequestDate?: string;
  cancelRequestDelayedDate?: string;
  rejectRequestDelayedDate?: string;
  declineCancelRequestDate?: string;
  declineRejectRequestDate?: string;
  freezeStatus?: FreezeStatus;

  // Added recently
  statusId?: number;
  documentStatusReason?: string;
  canbeCancelledUntil?: string;
  canbeRejectedUntil?: string;
  submissionChannel?: number;
  serviceDeliveryDate?: string;
  customsClearanceDate?: string;
  customsDeclarationNumber?: any;
  ePaymentNumber?: any;
  additionalMetadata?: AdditionalMetadata[];
  uuid?: string;
  publicUrl?: string;
  purchaseOrderDescription?: string;
  totalItemsDiscountAmount?: number;
  payment?: EtaPayment;
  delivery?: Delivery;
  totalAmount?: number;
  taxTotals?: number;
  netAmount?: number;
  totalDiscount?: number;
  totalSales?: number;
  invoiceLines: EtaInvoiceLine[]; // Invoice lines of the invoice. Needs to have at least one invoice line.
  documentLinesTotalCount?: number;
  references?: any;
  salesOrderDescription?: string;
  salesOrderReference?: string;
  proformaInvoiceNumber?: string;
  signatures?: EtaSignature[];
  purchaseOrderReference?: string;
  internalID?: string;
  taxpayerActivityCode?: string;
  dateTimeIssued?: string;
  documentTypeVersion?: string;
  documentType?: EtaInvoiceType;
  documentTypeNamePrimaryLang?: string;
  documentTypeNameSecondaryLang?: string;
  issuer?: Issuer;
  receiver?: Issuer;
  extraDiscountAmount?: number;
  maxPercision?: number;
  currenciesSold?: string;
  lateSubmissionRequestNumber?: any;
  currencySegments?: CurrencySegments[];
}

export enum EtaInvoiceType {
  INVOICE = 'I',
  // CREDIT = 'C',
  // DEBIT = 'D',
  CREDIT_NOTE = 'C',
  DEBIT_NOTE = 'D',
  // IMPORT_INVOICE = 'II',
  EXPORT_INVOICE = 'EI',
  EXPORT_CREDIT_NOTE = 'EC',
  EXPORT_DEBIT_NOTE = 'ED',
}

export interface CurrencySegments {
  currency?: string;
  currencyExchangeRate?: number;
  totalItemsDiscountAmount?: number;
  totalAmount?: number;
  taxTotals?: TaxTotal[];
  netAmount?: number;
  totalDiscount?: number;
  totalSales?: number;
  extraDiscountAmount?: number;
  totalTaxableFees?: number;
}

export class TaxTotal {
  taxType: string;
  amount: number;
}

export enum DocumentFullStatus {
  SUBMITTED = 'Submitted',
  VALID = 'Valid',
  INVALID = 'Invalid',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
}

export enum ValidationStatus {
  INPROGRESS = 'In Progress',
  VALID = DocumentFullStatus.VALID,
  INVALID = DocumentFullStatus.INVALID,
}

export interface EtaInvoiceLine {
  itemPrimaryName?: string;
  itemPrimaryDescription?: string;
  itemSecondaryName?: string;
  itemSecondaryDescription?: string;
  unitTypePrimaryName?: string;
  unitTypePrimaryDescription?: string;
  unitTypeSecondaryName?: string;
  unitTypeSecondaryDescription?: string;
  weightUnitTypePrimaryName?: string;
  weightUnitTypePrimaryDescription?: string;
  weightUnitTypeSecondaryName?: string;
  weightUnitTypeSecondaryDescription?: string;
  salesTotalForeign?: number;
  netTotalForeign?: number;
  totalForeign?: number;
  totalTaxableFeesForeign?: number;
  itemsDiscountForeign?: number;
  valueDifferenceForeign?: number;
  discountForeign?: DiscountForeign;
  lineTaxableItems?: any[];
  weightUnitType?: any;
  weightQuantity?: number;
  factoryUnitValue?: any;
  description?: string;
  itemType?: 'EGS' | 'GS1'; // Must be GS1 or EGS for this version.
  itemCode?: string;
  unitType?: string; // TODO: list of codes
  quantity?: number; // decimal
  unitValue?: UnitValue;
  salesTotal?: number; // decimal
  total?: number; // decimal
  valueDifference?: number; // decimal accept + or - values
  totalTaxableFees?: number; // decimal
  netTotal?: number; // decimal
  itemsDiscount?: number; // decimal
  discount?: Discount;
  taxableItems?: TaxableItems[];
  internalCode?: string;
}

export interface TaxableItems {
  taxType?: string; // TODO:
  amount?: number; // decimal
  subType?: string; // TODO:
  rate?: number; // decimal
}

export interface Discount {
  rate?: number;
  amount?: number;
}

export interface DiscountForeign {
  amountForeign: number;
  rate: any;
  amount: number;
}

export class UnitValue {
  currencySold: string;
  amountEGP: number; // decimal Price of unit of goods/services sold in EGP. Should be valid decimal with max 5 decimal digits. Value rounded to 5 decimal digits if calculated using currency sold and exchange rate.
  amountSold: number; // decimal
  currencyExchangeRate: number; // decimal Exchange rate of the Egyptian bank on the day of invoicing used to convert currency sold to the value of currency EGP. Mandatory if currencySold is not EGP. Should be valid decimal with max 5 decimal digits.
}

export interface AdditionalMetadata {
  fieldName?: FieldName;
  fieldValue?: string;
  fieldType?: FieldType;
  fieldNameDescEn?: string;
  fieldNameDescAr?: string;
}

export enum FieldName {
  CUSTOMS_DECLARATION_DATE = 'CustomsDeclarationDate',
  CUSTOMS_DECLARATION_ID = 'CustomsDeclarationID',
  PAYMENT_NO = 'PaymentNo',
  EXPORT_PORT = 'ExportPort',
}

export enum FieldType {
  STRING = 'String',
  BOOLEAN = 'Boolean',
  DATE_TIME = 'DataTime',
  NUMBER = 'Number',
}

export interface FreezeStatus {
  frozen?: boolean;
  type?: FreezeType;
  scope?: FreezeScope;
  actionDate?: Date;
  auCode?: string;
  auName?: string;
}

export enum FreezeScope {
  NOT_SET = 0,
  FULL = 1,
  CANCELLATION = 2,
}

export enum FreezeType {
  UN_FREEZED = 0,
  TEMPORARY_FREEZE = 1,
  PERMANENT = 2,
}

export enum TransformationStatus {
  ORIGINAL = 'original',
  TRANSFORMED = 'transformed',
}

export interface ErrorResponse {
  propertyName?: string;
  propertyPath?: string;
  errorCode?: string;
  error?: string;
  errorAr?: string;
  innerError?: ErrorResponse[];
}
