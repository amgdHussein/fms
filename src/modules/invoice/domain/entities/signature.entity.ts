import { Authority } from '../../../../core/common';

export interface Signature {
  id: string;
  invoiceId: string;

  authority: Authority;
  type: string; // Depend on the tax authority
  value: string; // Public URL of the signature

  createdBy: string; // User who created the signature
  createdAt: number; // Timestamp when the signature was created
  updatedBy: string; // User who last updated the signature
  updatedAt: number; // Timestamp when the signature was last updated
}
