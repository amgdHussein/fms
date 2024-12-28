import { Authority } from '../../../../core/common';

export interface Submission {
  id: string;
  invoiceId: string;
  organizationId: string;

  authority: Authority;
  signature: string; // The output of the user's private key signature

  submissionId: string; // Unique ID for authority submission
  status: 'rejected' | 'accepted';
  reason?: string; // Reason for rejection
  data?: Record<string, unknown>; // Full authority submission data after the invoice being processed

  createdBy: string; // User who submit the invoice
  createdAt: number; // Timestamp when the invoice was submitted
  updatedBy: string; // User who last updated or resubmitted the invoice
  updatedAt: number; // Timestamp when the invoice was last updated
}
