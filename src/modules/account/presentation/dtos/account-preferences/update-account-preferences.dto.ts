import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { AccountPreferencesDto } from './account-preferences.dto';

export class UpdateAccountPreferencesDto extends IntersectionType(
  PickType(AccountPreferencesDto, ['id']),
  PartialType(PickType(AccountPreferencesDto, ['email', 'activeSystemId', 'phone'])),
) {}
