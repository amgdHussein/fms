import { Authority } from '../../../../core/common';
import { EtaCodeType } from '../../../../core/providers';

import { AuthorityCodeStatus } from './authority-code-status.enum';
import { CodeStatus } from './code-status.enum';
import { CodeType } from './code-type.enum';

export interface Code {
  id: string;
  organizationId: string; // Unique ID for the organization

  status: CodeStatus; // Status of the code
  type: CodeType; // Type of the code

  authority: Authority; // Tax authority data for that code
  code: string; // Unique code (id) for the organization

  activeAt: number;
  expireAt?: number; // (Can be updated)
  authorityStatus: AuthorityCodeStatus; // Status of the code

  name: string; // Name of the code
  description: string; // Description of the code
  nameAr?: string;
  descriptionAr?: string;

  category: string; // Category of Authority, default is "Other"
  comment?: string; // Comment for the code
  cause?: string; // Cause of the submission failure

  createdBy: string; // User who created the tax-code
  createdAt: number; // Timestamp when the tax-code was created
  updatedBy: string; // User who last updated the tax-code
  updatedAt: number; // Timestamp when the tax-code was last updated

  // ? Authority Specific Data

  // * ETA
  linkedCode?: string; // EGS Related Linked Code
  internationalCode?: string; // Global Product Classification (GPC) code
  authorityCodeType?: EtaCodeType; // EGS, GS1
  requestId?: number; // (codeUsageRequestId) EGS Code Usage Request ID
}
