import { OmitType } from '@nestjs/swagger';

import { ClientDto } from './client.dto';

export class AddClientDto extends OmitType(ClientDto, ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']) {}
