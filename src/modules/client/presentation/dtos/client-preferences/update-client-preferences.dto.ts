import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';

import { ClientPreferencesDto } from './client-preferences.dto';

export class UpdateClientPreferencesDto extends IntersectionType(
  PickType(ClientPreferencesDto, ['id']),
  PartialType(OmitType(ClientPreferencesDto, ['id', 'clientId', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])),
) {}
