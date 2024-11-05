import { Authority } from '../../../../core/common';

export interface Submission {
  id: string;
  invoiceId: string;
  submissionId: string; // Unique ID for authority submission
  signatureId: string;

  authority: Authority;
  status: 'rejected' | 'accepted';

  rejectionReason?: string; // Reason for rejection
  data?: Record<string, unknown>; // Full Eta submission data after the invoice being processed

  createdBy: string; // User who submit the invoice
  createdAt: number; // Timestamp when the invoice was submitted
  updatedBy: string; // User who last updated or resubmitted the invoice
  updatedAt: number; // Timestamp when the invoice was last updated
}
