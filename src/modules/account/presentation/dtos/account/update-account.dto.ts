import { PartialType, PickType } from '@nestjs/swagger';

import { AccountDto } from './account.dto';

export class UpdateAccountDto extends PartialType(PickType(AccountDto, ['status', 'type', 'role', 'startAt', 'endAt'])) {}
