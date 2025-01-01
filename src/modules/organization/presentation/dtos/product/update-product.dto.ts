import { OmitType, PartialType } from '@nestjs/swagger';

import { OrganizationProductDto } from './product.dto';

export class UpdateOrganizationProductDto extends PartialType(
  OmitType(OrganizationProductDto, ['id', 'organizationId', 'status', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']),
) {}
