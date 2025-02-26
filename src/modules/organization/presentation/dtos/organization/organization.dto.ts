import { CurrencyCode } from '../../../../../core/enums';
import { Address, Phone, Photo } from '../../../../../core/models';

import { LegalStructure, Organization, OrganizationIndustry, OrganizationStatus } from '../../../domain';

// TODO: FILL THE DTO
export class OrganizationDto implements Organization {
  id: string;
  userId: string;
  branchId: string;
  status: OrganizationStatus;

  name: string;
  email: string;
  address: Address;

  phone?: Phone;
  mobile?: Phone;
  fax?: Phone;

  logo?: Photo;
  website?: string;

  currency: CurrencyCode;
  industry?: OrganizationIndustry;
  legalStructure?: LegalStructure;

  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
