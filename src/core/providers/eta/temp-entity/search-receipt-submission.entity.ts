import { IssuerType } from '../entities';
import { SubmissionChannels } from './receipt-details.entity';
import { ReceiptType } from './receipt.entity';

export interface SearchReceiptSubmissionQuery {
  DocumentId?: string;
  ReceiptNumber?: string;
  DocumentTypeCode?: ReceiptType;
  DocumentTypeName?: string;
  DocumentTypeVersionNumber?: string;
  ReceiverId?: string;
  ReceiverName?: string;
  Status?: 'Valid' | 'Invalid' | 'Cancelled';
  SortBy?: 'None' | 'DateTimeIssued' | 'DateTimeReceived';
  SortDir?: 'None' | 'Asc' | 'Desc';
  PageNo?: number;
  PageSize?: number;
}

export interface SearchReceiptSubmissionResponse {
  submissionUuid?: string;
  sellerId?: string;
  dateTimeReceived?: string;
  dateTimeIssued?: string;
  submitterName?: string;
  deviceSerialNumber?: string;
  submissionChannel?: SubmissionChannels;
  receiptsCount?: number;
  invalidReceiptsCount?: number;
  status?: 'Valid' | 'Invalid' | 'InProgress';

  submissionErrors?: SubmissionError[];

  receipts?: ReceiptSubmissionDocumentSummary[];
  metadata?: {
    totalPages?: number;
    totalCount?: number;
    currentPageNo?: number;
  };
}

export interface SubmissionError {
  propertyPath?: string;
  errorCode?: string;
  error?: string;
  errorAr?: string;
  metadata?: string;
  innerError?: SubmissionError[];
}

export interface ReceiptSubmissionDocumentSummary {
  uuid?: string;
  receiptNumber?: string;
  dateTimeIssued?: string;
  dateTimeReceived?: string;
  documentType?: ReceiptType;
  documentTypeNamePrimaryLanguage?: string;
  documentTypeNameSecondaryLanguage?: string;
  currency?: string;
  currencyNamePrimaryLang?: string;
  currencyNameSecondaryLang?: string;
  documentTypeVersion?: string;
  totalAmount?: number;
  exchangeRate?: number;
  sellerId?: string;
  buyerId?: string;
  buyerName?: string;
  buyerType?: IssuerType;
  status?: 'Valid' | 'Invalid' | 'Cancelled';
  longId?: string;
  deviceSerialNumber?: string;
  errors?: {
    stepId?: string;
    stepName?: string;
    stepNameAr?: string;
    error?: SubmissionError;
  }[];
}
