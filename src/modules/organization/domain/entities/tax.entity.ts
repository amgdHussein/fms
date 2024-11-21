import { Authority } from '../../../../core/common';

export interface OrganizationTax {
  id: string;
  organizationId: string;
  authority: Authority; // Tax authority data for that organization

  taxIdNo: string; // Tax ID number of the organization
  clientId: string; // The client ID provided by the FTA
  clientSecret: string; // The client secret provided by the FTA
  apiVersion: string; // API version (e.g. 1.0) Fixed

  usbPin: string; // The USB token pin (encrypted)
  usbCertificateName?: string; // The USB token certificate name

  activityCodes?: ActivityCode[]; // User must specify the activity codes that are relevant to their business

  createdBy: string; // User who created the organization tax
  createdAt: number; // Timestamp when the organization tax was created
  updatedBy: string; // User who last updated the organization tax
  updatedAt: number; // Timestamp when the organization tax was last updated
}

export interface ActivityCode {
  code: string;
  description: string;
  descriptionAr: string;
}
