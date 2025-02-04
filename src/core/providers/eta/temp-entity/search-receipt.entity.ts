import { SubmissionChannels } from './receipt-details.entity';
import { EtaPaymentMethod, ReceiptType } from './receipt.entity';

export interface SearchReceiptQuery {
  FreeText: string;
  Direction: 'Received' | 'Submitted';
  DateTimeIssuedFrom: string;
  DateTimeIssuedTo: string;
  DateTimeReceivedFrom: string;
  DateTimeReceivedTo: string;
  DocumentTypeCode: ReceiptType[];
  DocumentTypeVersion: string;
  ReceiverName: string;
  ReceiverRegisterationNumber: string; // RIN of the receiver, this filter is applicable only if buyer type is B. If buyer type is P or F use FreeText Field to filter by Receiver ID
  PosSerialNumber: string;
  SubmissionChannel: SubmissionChannels;
  SortBy: 'None' | 'DateTimeIssued' | 'DateTimeReceived';
  SortDir: 'None' | 'Asc' | 'Desc';
  PageNo: number;
  PageSize: number;
}

export interface SearchReceiptResponse {
  receipts: SearchReceiptDocumentSummary[];
  metadata: {
    totalPages: number;
    totalCount: number;
  };
}

export interface SearchReceiptDocumentSummary {
  submissionUuid: string;
  uuid: string;
  referenceUuid: string;
  direction: 'none' | 'all' | 'received' | 'submitted';
  receiptNumber: string;
  dateTimeIssued: string;
  dateTimeReceived: string;
  totalAmount: number;
  posSerialNumber: string;
  paymentMethod: EtaPaymentMethod;
  submitterName: string;
  submissionChannel: SubmissionChannels;
  status: 'valid' | 'cancelled';
  issuerId: string;
  issuerName: string;
  receiverId: string;
  receiverName: string;
  typeName: string; //TODO: CHECK IF TYPE NAME IS THE SAME AS DOCUMENT TYPE NAME
  documentTypeNamePrimaryLanguage: string;
  documentTypeNameSecondaryLanguage: string;
  typeVersionName: string;
  currency: string;
  currencyNamePrimaryLang: string;
  currencyNameSecondaryLang: string;
  exchangeRate: number;
}
