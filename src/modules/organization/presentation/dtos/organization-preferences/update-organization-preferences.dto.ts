import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';

import { OrganizationPreferencesDto } from './organization-preferences.dto';

export class UpdateOrganizationPreferencesDto extends IntersectionType(
  PickType(OrganizationPreferencesDto, ['id']),
  PartialType(OmitType(OrganizationPreferencesDto, ['id', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])),
) {}
