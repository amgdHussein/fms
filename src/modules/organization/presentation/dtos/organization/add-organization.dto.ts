import { OmitType } from '@nestjs/swagger';

import { OrganizationDto } from './organization.dto';

export class AddOrganizationDto extends OmitType(OrganizationDto, ['id', 'status', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']) {}
