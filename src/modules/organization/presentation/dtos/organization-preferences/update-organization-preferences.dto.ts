import { OmitType, PartialType } from '@nestjs/swagger';

import { OrganizationPreferencesDto } from './organization-preferences.dto';

export class UpdateOrganizationPreferencesDto extends PartialType(
  OmitType(OrganizationPreferencesDto, ['id', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']),
) {}
