import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { UserPreferencesDto } from './user-preferences.dto';

export class UpdateUserPreferencesDto extends IntersectionType(
  PickType(UserPreferencesDto, ['id']),
  PartialType(PickType(UserPreferencesDto, ['email', 'language', 'phone'])),
) {}
