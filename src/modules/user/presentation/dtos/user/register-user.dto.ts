import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class RegisterUserDto extends IntersectionType(PickType(UserDto, ['id', 'email']), PartialType(PickType(UserDto, ['role']))) {}
