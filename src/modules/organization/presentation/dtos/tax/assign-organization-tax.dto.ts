import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { OrganizationTaxDto } from './organization-tax.dto';

class RequiredTaxFields extends PickType(OrganizationTaxDto, ['taxIdNo', 'authority']) {}

class PartialTaxFields extends PartialType(OmitType(OrganizationTaxDto, ['id', 'authority', 'taxIdNo', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])) {}

export class AssignOrganizationTaxDto extends IntersectionType(RequiredTaxFields, PartialTaxFields) {}
