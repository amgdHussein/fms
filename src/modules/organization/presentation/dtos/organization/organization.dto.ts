import { CurrencyCode, Phone, Photo } from '../../../../../core/common';

import { LegalStructure, Organization, OrganizationIndustry, OrganizationStatus } from '../../../domain';

// TODO: Fill the DTO
export class OrganizationDto implements Organization {
  id: string;
  preferencesId: string;
  systemId: string;
  userId: string;
  status: OrganizationStatus;
  name: string;
  email: string;
  phone?: Phone;
  logo: Photo;
  website?: string;
  currency: CurrencyCode;
  industry: OrganizationIndustry;
  legalStructure?: LegalStructure;
  timezone: string;
  startWeekOn?: number;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
