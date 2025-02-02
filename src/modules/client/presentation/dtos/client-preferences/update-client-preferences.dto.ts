import { OmitType, PartialType } from '@nestjs/swagger';

import { ClientPreferencesDto } from './client-preferences.dto';

export class UpdateClientPreferencesDto extends PartialType(OmitType(ClientPreferencesDto, ['id', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])) {}
