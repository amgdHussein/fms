import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';

import { OrganizationDto } from './organization.dto';

export class UpdateOrganizationDto extends IntersectionType(
  PickType(OrganizationDto, ['id']),
  PartialType(OmitType(OrganizationDto, ['id', 'preferencesId', 'userId', 'systemId', 'status', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])),
) {}
