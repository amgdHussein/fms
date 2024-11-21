import { CurrencyCode, Phone, Photo } from '../../../../core/common';

import { OrganizationIndustry } from './industry.enum';
import { LegalStructure } from './legal-structure.enum';
import { OrganizationStatus } from './status.enum';

export interface Organization {
  id: string;
  preferencesId: string; // Unique ID for the preferences
  userId: string; // Organization owner

  status: OrganizationStatus;

  name: string; // Company name or organization name
  email: string; // Email address of the organization
  phone?: Phone; // Phone number of the organization

  logo: Photo;
  website?: string;

  currency: CurrencyCode; // Primary currency
  industry: OrganizationIndustry; // Enum of strings like marketing, software industry
  legalStructure?: LegalStructure;

  timezone: string;
  startWeekOn?: number; // 0 - 6 (0 = Sunday, 6 = Saturday)

  createdBy: string; // User who created the organization
  createdAt: number; // Timestamp when the organization was created
  updatedBy: string; // User who last updated the organization
  updatedAt: number; // Timestamp when the organization was last updated
}
