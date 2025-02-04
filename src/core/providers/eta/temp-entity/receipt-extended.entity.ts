import { EtaCodeType, IssuerType } from '../entities';
import { SubmissionChannels } from './receipt-details.entity';
import { EtaPaymentMethod, EtaReceiptDiscountData, EtaReceiptTaxableItem, ReceiptType } from './receipt.entity';

export interface ReceiptExtended {
  rawDocument: string;
  submissionUUID: string;
  dateTimeReceived: string;
  dateTimeIssued: string;
  submissionChannel: SubmissionChannels;
  maxPrecision: number;
  receipt: ReceiptDocumentSummary; // CAN BE different TYPE OF RECCEIPT
}

export interface ReceiptDocumentSummary {
  uuid: string;
  longId: string;
  previousUUID: string;
  referenceOldUUID: string;
  referenceUUID: string;
  dateTimeIssued: string;
  dateTimeReceived: string;
  receiptNumber: string;
  currency: string;
  exchangeRate: number;
  sOrderNameCode: string;
  orderDeliveryMode: string;
  grossWeight: number;
  netWeight: number;
  documentType: {
    receiptTypeCategory: string;
    receiptTypeBase: string;
    receiptType: ReceiptType;
    receiptTypeName: string;
    receiptTypeNameAr: string;
    typeVersion: string;
  };
  totalSales: number;
  totalAmount: number;
  totalCommercialDiscount: number;
  totalItemsDiscount: number;
  netAmount: number;
  feesAmount: number;
  paymentMethod: EtaPaymentMethod;
  adjustment: number;

  // Check the below properties
  seller?: {
    sellerId?: string;
    sellerName?: string;
    branchCode: string;
    deviceSerialNumber?: string;
    syndicateLicenseNumber: string;
    activityCode: string;
    branchAddress: {
      country?: string;
      governate?: string;
      regionCity?: string;
      street?: string;
      buildingNumber?: string;
      postalCode?: string;
      floor?: string;
      room?: string;
      landmark?: string;
      additionalInformation?: string;
      countryName?: string;
      countryNameAR?: string;
    };
    branchName?: string;
    branchNameAr?: string;
  };
  buyer?: {
    buyerId?: string;
    buyerName?: string;
    type?: IssuerType;
    mobileNumber?: string;
    paymentNumber?: string;
  };
  itemData: DuplicatedEtaReceiptItemData[];
  extraReceiptDiscount?: EtaReceiptDiscountData[];
  //TODO: Check the below IF ARRAY OR NOT
  taxTotals?: {
    taxType?: string;
    amount?: number;
    taxTypeName?: string;
    taxTypeNameAr?: string;
  }[];

  contractor?: {
    name?: string;
    amount?: number;
    rate?: number;
  };
  beneficiary?: {
    amount?: number;
    rate?: number;
  };
  status?: string;
  statusReason?: string;
  hasReturnReceipts?: boolean;
  returnReceipts: {
    uuid: string;
    dateTimeIssued: string;
  };
  history?: ReceiptHistory;
}

export interface ReceiptHistory {
  date: string;
  status: string;
  reason: string;
  submissionUuid: string;
  canceledBy: string;
}

export interface DuplicatedEtaReceiptItemData {
  internalCode?: string;
  description?: string;
  itemType?: EtaCodeType; // EGS or GS1
  itemCode?: string;
  unitType?: string;
  quantity?: number;
  unitPrice?: number;
  netSale?: number;
  totalSale?: number;
  total?: number;
  valueDifference?: number;
  commercialDiscount?: EtaReceiptDiscountData[];
  itemDiscount?: EtaReceiptDiscountData[];
  additionalCommercialDiscount?: EtaReceiptDiscountData;
  additionalItemDiscount?: EtaReceiptDiscountData;
  taxableItems?: AdditionalEtaReceiptTaxableItem[];
  itemCodeName?: string;
  itemCodeNameAr?: string;
  unitTypeName?: string;
  unitTypeNameAr?: string;
}

export interface AdditionalEtaReceiptTaxableItem extends EtaReceiptTaxableItem {
  sign?: ReceiptSign;
  exchangeRate?: number;
  taxTypeName?: string;
  taxTypeNameAr?: string;
}

export enum ReceiptSign {
  SALES = 1,
  RETURN = -1,
}
