import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class UpdateUserDto extends IntersectionType(
  PickType(UserDto, ['id']),
  PartialType(OmitType(UserDto, ['id', 'role', 'status', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])),
) {}
