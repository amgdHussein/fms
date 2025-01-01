import { OmitType, PartialType } from '@nestjs/swagger';
import { OrganizationTaxDto } from './organization-tax.dto';

export class AddOrganizationTaxDto extends PartialType(OmitType(OrganizationTaxDto, ['id', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])) {}
