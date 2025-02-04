import { SubmissionChannels } from './receipt-details.entity';
import { EtaPaymentMethod, ReceiptType } from './receipt.entity';
import { SearchReceiptDocumentSummary } from './search-receipt.entity';

export interface SearchRecentReceiptQuery {
  Uuid: string;
  SubmissionUuid: string;
  ReceiptNumber: string;
  DocumentTypeCode: ReceiptType[];
  DocumentTypeVersion: string;
  ReceiverName: string;
  ReceiverRegisterationNumber: string; // RIN of the receiver, this filter is applicable only if buyer type is B. If buyer type is P or F use FreeText Field to filter by Receiver ID
  DeviceSerialNumber: string;
  PaymentMethod: EtaPaymentMethod;
  SubmissionChannel: SubmissionChannels;
  Status: 'valid' | 'cancelled';
  Direction: 'Received' | 'Submitted';
  SortBy: 'None' | 'DateTimeIssued' | 'DateTimeReceived';
  SortDir: 'None' | 'Asc' | 'Desc';
  PageNo: number;
  PageSize: number;
}

export interface GetRecentReceiptsResponse {
  receipts: SearchReceiptDocumentSummary[];
  metadata: {
    totalPages: number;
    totalCount: number;
    firstReceiptDateTimeReceived: string;
    lastReceiptDateTimeReceived: string;
    maxRecordCount: number;
    showReceiptsReceivedSinceMonthCount: number;
  };
}
