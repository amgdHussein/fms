import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { ClientDto } from './client.dto';

export class AddClientsDto {
  @ValidateNested({ each: true })
  @Type(() => ClientDto)
  @ApiProperty({
    name: 'clients',
    type: Array<ClientDto>,
    required: true,
    description: 'Array of clients to set.',
  })
  clients: ClientDto[];
}
