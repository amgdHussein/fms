import { DocumentFullStatus, EtaInvoiceType, FreezeStatus } from './eta-invoice.entity';
import { IssuerType } from './issuer.entity';

export class QueryCodes {
  PageSize: number;
  PageNumber: number;
  TaxpayerRIN?: string;
  CodeLookupValue?: string;
  ParentCodeLookupValue?: string;
  CodeID?: number;
  CodeName?: string;
  CodeDescription?: string;
  ParentCodeID?: number;
  ParentLevelName?: string;
  OnlyActive?: boolean;
  ActiveFrom?: string;
  ActiveTo?: string;
  CodeTypeLevelNumber?: number;
  ItemCode?: string;
  ParentItemCode?: string;
  Active?: boolean;
  Status?: 'Submitted' | 'Approved' | 'Rejected';
  RequestType?: 'New' | 'Reusage';
}

export class GetInvoices {
  pageSize: number;

  submissionDateFrom: string;

  submissionDateTo: string;

  continuationToken: string;

  issueDateFrom: string;

  issueDateTo: string;

  direction: 'Sent' | 'Received';

  status: DocumentFullStatus;

  documentType: EtaInvoiceType;

  receiverType: IssuerType;

  receiverId: string;

  issuerType: 'B' | 'F';

  issuerId: string;
}

export interface InvoiceQueryResult {
  uuid?: string;
  submissionUUID?: string;
  longId?: string;
  publicUrl?: string;
  internalId?: string;
  typeName?: 'I' | 'C' | 'D' | 'II' | 'EI' | 'EC' | 'ED';
  typeVersionName?: string;
  documentTypeNamePrimaryLang?: string;
  documentTypeNameSecondaryLang?: string;
  issuerId?: string;
  issuerName?: string;
  issuerType?: 'B' | 'F';
  receiverId?: string;
  receiverName?: string;
  receiverType?: IssuerType;
  dateTimeIssued?: string;
  dateTimeReceived?: string;
  totalSales?: number;
  totalDiscount?: number;
  netAmount?: number;
  total?: number;
  status?: DocumentFullStatus;
  cancelRequestDate?: string;
  rejectRequestDate?: string;
  cancelRequestDelayedDate?: string;
  rejectRequestDelayedDate?: string;
  declineCancelRequestDate?: string;
  declineRejectRequestDate?: string;
  documentStatusReason?: string;
  createdByUserId?: string;
  freezeStatus?: FreezeStatus;
  lateSubmissionRequestNumber?: any;
}
