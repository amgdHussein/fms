import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';

import { ClientDto } from './client.dto';

export class UpdateClientDto extends IntersectionType(
  PickType(ClientDto, ['id']),
  PartialType(OmitType(ClientDto, ['id', 'systemId', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])),
) {}
