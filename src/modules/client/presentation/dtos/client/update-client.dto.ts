import { OmitType, PartialType } from '@nestjs/swagger';

import { ClientDto } from './client.dto';

export class UpdateClientDto extends PartialType(OmitType(ClientDto, ['id', 'organizationId', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])) {}
