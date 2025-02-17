import { Address } from '../../../../core/common';
import { EtaCredentials } from '../../../../core/providers';

export interface Branch extends Address {
  id: string;
  organizationId: string;

  branchCode: string; // Generate by Tax authority
  name: string; // Name of the branch
  posDevices?: PosDevice[]; // List of POS devices

  buildingNumber: string;

  floor?: string;
  room?: string;
  landmark?: string;
  additionalInformation?: string; //TODO: ADD TO ALL FORMS

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
  credentials: EtaCredentials;
  // test?: EtaCredentials;
}
