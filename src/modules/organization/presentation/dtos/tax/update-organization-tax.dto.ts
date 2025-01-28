import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { OrganizationTaxDto } from './organization-tax.dto';

export class UpdateOrganizationTaxDto extends IntersectionType(
  PartialType(OmitType(OrganizationTaxDto, ['id', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])),
  PickType(OrganizationTaxDto, ['authority']),
) {}
