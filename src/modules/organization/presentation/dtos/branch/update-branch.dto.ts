import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';

import { OrganizationBranchDto } from './branch.dto';

export class UpdateOrganizationBranchDto extends IntersectionType(
  PickType(OrganizationBranchDto, ['id']),
  PartialType(OmitType(OrganizationBranchDto, ['id', 'organizationId', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])),
) {}
