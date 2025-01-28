import { Authority, Photo } from '../../../../../core/common';

import { ActivityCode, EtaFlag, OrganizationTax } from '../../../domain';

// TODO: FILL THE DTO
export class OrganizationTaxDto implements OrganizationTax {
  id: string;
  authority: Authority;
  configurationFlags: Record<EtaFlag, boolean>;
  taxIdNo: string;
  taxIdPhoto?: Photo;
  commercialRegistryNo?: string;
  commercialRegistryPhoto?: Photo;
  clientId: string;
  clientSecret: string;
  activityCodes?: ActivityCode[];
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
