import { OmitType } from '@nestjs/swagger';

import { OrganizationBranchDto } from './branch.dto';

export class AddOrganizationBranchDto extends OmitType(OrganizationBranchDto, ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']) {}
