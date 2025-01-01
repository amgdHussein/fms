import { OmitType, PartialType } from '@nestjs/swagger';
import { OrganizationTaxDto } from './organization-tax.dto';

export class UpdateOrganizationTaxDto extends PartialType(
  OmitType(OrganizationTaxDto, ['id', 'organizationId', 'authority', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']),
) {}
