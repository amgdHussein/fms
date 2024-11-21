import { OmitType } from '@nestjs/swagger';
import { AccountDto } from './account.dto';

export class AddAccountDto extends OmitType(AccountDto, ['id', 'preferencesId', 'createdBy', 'createdAt', 'updatedAt', 'updatedBy']) {}
