export interface SetReceiptsResponse {
  submissionId: string;
  acceptedDocuments: DocumentAccepted[];
  rejectedDocuments: DocumentRejected[];
  header: {
    statusCode?: string;
    code?: string;
    details?: any[];
    correlationId?: string;
    requestTime?: string;
    responseProcessingTimeInTicks?: number;
  };
}

export interface DocumentAccepted {
  uuid?: string;
  longId?: string;
  receiptNumber?: string;
  hashKey?: string;
}

export interface DocumentRejected {
  receiptNumber?: string;
  uuid?: string;
  error?: DocumentRejectedError;
}

export interface DocumentRejectedError {
  message?: string;
  target?: string;
  propertyPath?: any; // TODO: check type in real test
  details?: DocumentRejectedError[];
  code?: string;
}
// Sample of rejected document
// {
// 	"receiptNumber": "1234566",
// 	"uuid": "43a235e58327bc4c198e1367a82080c45e076c4d6a62e3dee330413af34a7306",
// 	"error": {
// 		"message": "Validation Error",
// 		"target": "43a235e58327bc4c198e1367a82080c45e076c4d6a62e3dee330413af34a7306",
// 		"details": [
// 			{
// 				"code": "CF313",
// 				"message": "Issuance date time value is out of the range of submission workflow parameter",
// 				"target": "DatetimeIssued",
// 				"propertyPath": "receipts.datetimeissued"
// 			}
// 		]
// 	}
// }
