import { Authority, Photo } from '../../../../core/common';
import { EtaCredentials } from '../../../../core/providers';
import { ActivityCode } from '../constants';

export interface OrganizationTax {
  id: string; // The ID of the organization
  authority: Authority; // Tax authority data for that organization

  configurationFlags?: Record<EtaFlag, boolean>; // Flags for the tax authority to control UI/API

  taxIdNo: string; // Tax ID number of the organization
  taxIdPhoto?: Photo; // Photo of the tax ID
  commercialRegistryNo?: string;
  commercialRegistryPhoto?: Photo;

  eInvoiceCredentials?: EtaCredentials; // E-Invoice credentials for the organization

  activityCodes?: ActivityCode[]; // User must specify the activity codes that are relevant to their business

  createdBy: string; // User who created the organization tax
  createdAt: number; // Timestamp when the organization tax was created
  updatedBy: string; // User who last updated the organization tax
  updatedAt: number; // Timestamp when the organization tax was last updated
}

export type EtaFlag = 'activeReceipt' | 'activeInvoice';
