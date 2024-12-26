import { Authority } from '../../../../core/common';
import { IssuerType } from '../../../../core/providers';

export interface ClientTax {
  id: string;
  clientId: string;
  organizationId: string;
  authority: Authority; // Tax authority data for that organization

  taxIdNo: string; // The issuer ID provided by the FTA
  type: IssuerType; // The issuer type provided by the FTA

  createdBy: string; // User who created the organization tax
  createdAt: number; // Timestamp when the organization tax was created
  updatedBy: string; // User who last updated the organization tax
  updatedAt: number; // Timestamp when the organization tax was last updated
}
