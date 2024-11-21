import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { AccountDto } from './account.dto';

export class UpdateAccountDto extends IntersectionType(
  PickType(AccountDto, ['id']),
  PartialType(PickType(AccountDto, ['status', 'type', 'role', 'startAt', 'endAt'])),
) {}
