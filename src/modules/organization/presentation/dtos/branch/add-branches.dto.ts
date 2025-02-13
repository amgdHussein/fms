import { OmitType } from '@nestjs/swagger';

import { OrganizationBranchDto } from './branch.dto';

class AddOrganizationBranchDto extends OmitType(OrganizationBranchDto, ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']) {}

export class AddOrganizationBranchesDto {
  branches: AddOrganizationBranchDto[];
}
