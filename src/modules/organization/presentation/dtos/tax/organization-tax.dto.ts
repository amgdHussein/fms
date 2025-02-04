import { Authority, Photo } from '../../../../../core/common';
import { EtaCredentials } from '../../../../../core/providers';

import { ActivityCode, EtaFlag, OrganizationTax } from '../../../domain';

// TODO: FILL THE DTO
export class OrganizationTaxDto implements OrganizationTax {
  id: string;
  authority: Authority;
  configurationFlags?: Record<EtaFlag, boolean>;
  taxIdNo: string;
  taxIdPhoto?: Photo;
  commercialRegistryNo?: string;
  commercialRegistryPhoto?: Photo;
  eInvoiceCredentials?: EtaCredentials; // E-Invoice credentials for the organization

  activityCodes?: ActivityCode[];
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
