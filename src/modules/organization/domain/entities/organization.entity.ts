import { Address, CurrencyCode, Phone, Photo } from '../../../../core/common';

import { OrganizationIndustry } from './industry.enum';
import { LegalStructure } from './legal-structure.enum';
import { OrganizationStatus } from './status.enum';

// TODO: REMOVE ALL PREFERENCES IDS AND MAKE THEM AS PARENT ID

export interface Organization {
  id: string;
  userId: string; // Organization owner
  branchId: string; // Main/Primary branch

  status: OrganizationStatus;

  name: string; // Company name or organization name
  email: string; // Email address of the organization
  address: Address;

  phone?: Phone; // Phone number of the organization
  mobile?: Phone;
  fax?: Phone;

  logo?: Photo;
  website?: string;

  currency: CurrencyCode; // Primary currency
  industry?: OrganizationIndustry; // Enum of strings like marketing, software industry
  legalStructure?: LegalStructure;

  createdBy: string; // User who created the organization
  createdAt: number; // Timestamp when the organization was created
  updatedBy: string; // User who last updated the organization
  updatedAt: number; // Timestamp when the organization was last updated
}
