import { Address } from '../../../../core/common';

export interface OrganizationBranch extends Address {
  id: string;
  organizationId: string;

  branchId: string; // Generate by Tax authority
  name: string; // Name of the branch
  posDevices: PosDevice[]; // List of POS devices

  createdBy: string; // User ID who created the branch
  createdAt: number; // Date when the branch was created
  updatedBy: string; // User ID who last updated the branch
  updatedAt: number; // Date when the branch was last updated
}

export interface PosDevice {
  name: string;
  serialNo: string;
  osVersion: string;
  isActive: boolean;
  production: { clientId: string; clientSecret: string };
  test?: { clientId: string; clientSecret: string };
}
