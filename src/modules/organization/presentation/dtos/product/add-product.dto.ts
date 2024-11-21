import { OmitType } from '@nestjs/swagger';

import { OrganizationProductDto } from './product.dto';

export class AddOrganizationProductDto extends OmitType(OrganizationProductDto, [
  'id',
  'organizationId',
  'status',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
]) {}
