import { PosDevice } from '../../../../modules/organization/domain/entities/branch.entity';
import { EtaCodeType, EtaCredentials, IssuerType } from '../entities';

export interface EtaReceipt {
  header: EtaReceiptHeader;
  documentType: EtaReceiptDocumentType;
  seller: EtaReceiptSeller;
  buyer: EtaReceiptBuyer;
  itemData: EtaReceiptItemData[];
  totalSales: number;
  totalCommercialDiscount?: number;
  totalItemsDiscount: number;
  extraReceiptDiscountData?: EtaReceiptDiscountData[];
  netAmount: number;
  // feesAmount: number; // will be used in feature
  totalAmount: number;
  //TODO: Check the below IF ARRAY OR NOT
  taxTotals?: {
    taxType: string;
    amount: number;
  }[];
  paymentMethod: EtaPaymentMethod;
  // adjustment: number; // will be used in feature
  contractor?: {
    name: string;
    amount: number;
    rate: number;
  };
  beneficiary?: {
    amount: number;
    rate: number;
  };
}

export enum EtaPaymentMethod {
  CASH = 'C',
  VISA = 'V',
  CASH_WITH_CONTRACTOR = 'CC',
  VISA_WITH_CONTRACTOR = 'VC',
  VOUCHERS = 'VO',
  PROMOTION = 'PR',
  GIFT_CARD = 'GC',
  POINTS = 'P',
  OTHERS = 'O',
}

export interface EtaReceiptItemData {
  internalCode: string;
  description: string;
  itemType: EtaCodeType; // EGS or GS1
  itemCode: string;
  unitType: string;
  quantity: number;
  unitPrice: number;
  netSale: number;
  totalSale: number;
  total: number;

  commercialDiscountData?: EtaReceiptDiscountData[];
  itemDiscountData?: EtaReceiptDiscountData[];
  additionalCommercialDiscount?: EtaReceiptDiscountData;
  additionalItemDiscount?: EtaReceiptDiscountData;
  valueDifference?: number;
  taxableItems?: EtaReceiptTaxableItem[];
}

export interface EtaReceiptTaxableItem {
  taxType: string;
  subType: string;
  rate?: number;
  amount: number;
}

export interface EtaReceiptDiscountData {
  amount: number;
  description: string;
  rate?: number;
}

export interface EtaReceiptHeader {
  dateTimeIssued: string; // utc 2022-02-03T00:00:00Z
  receiptNumber: string;
  uuid: string; // Mandatory, SHA256 format. UUID is a unique key on system level added by taxpayer, it is generated based on receipt content as per receipt base schema, Steps to generate UUID
  previousUUID?: string;
  referenceUUID?: string;
  referenceOldUUID?: string;
  currency: string;
  exchangeRate?: number;
  sOrderNameCode?: string;
  orderdeliveryMode?: string;
  grossWeight?: number;
  netWeight?: number;
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

export interface EtaReceiptDocumentType {
  receiptType: ReceiptType;
  typeVersion: string;
}

export interface EtaReceiptSeller {
  rin: string;
  companyTradeName: string;
  branchCode: string;
  branchAddress: EtaReceiptBranchAddress;
  deviceSerialNumber: string;
  syndicateLicenseNumber: string; // Optional. In case it is a person, then it is a number of minimum 10 characters, if the number is less than 10 characters, leading zeros should be added, example: “0001234567”. In case it is a company, the value should be “C”
  activityCode: string;
}

export interface EtaReceiptBranchAddress {
  country: string;
  governate: string;
  regionCity: string;
  street: string;
  buildingNumber: string;
  postalCode?: string;
  floor?: string;
  room?: string;
  landmark?: string;
  additionalInformation?: string;
}

export interface EtaReceiptBuyer {
  type: IssuerType;
  id: string;
  name: string;
  mobileNumber?: string;
  paymentNumber?: string;
}

export interface EReceiptCredentials extends EtaCredentials {
  pos: PosDevice;
}
