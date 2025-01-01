import { OmitType, PartialType } from '@nestjs/swagger';

import { OrganizationBranchDto } from './branch.dto';

export class UpdateOrganizationBranchDto extends PartialType(
  OmitType(OrganizationBranchDto, ['id', 'organizationId', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']),
) {}
