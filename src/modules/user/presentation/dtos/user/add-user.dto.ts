import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class AddUserDto extends OmitType(UserDto, ['role', 'status', 'createdBy', 'createdAt', 'updatedAt', 'updatedBy']) {}
