import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';

import { OrganizationProductDto } from './product.dto';

export class UpdateOrganizationProductDto extends IntersectionType(
  PickType(OrganizationProductDto, ['id']),
  PartialType(OmitType(OrganizationProductDto, ['id', 'organizationId', 'status', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])),
) {}
