import { CurrencyCode, Phone, Photo } from '../../../../../core/common';

import { LegalStructure, Organization, OrganizationIndustry, OrganizationStatus } from '../../../domain';

// TODO: FILL THE DTO
export class OrganizationDto implements Organization {
  id: string;
  userId: string;
  branchId: string;
  status: OrganizationStatus;
  name: string;
  email: string;
  phone?: Phone;
  logo: Photo;
  website?: string;
  currency: CurrencyCode;
  industry: OrganizationIndustry;
  legalStructure?: LegalStructure;

  isProductionMode: boolean; // Whether the account is in production mode

  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
