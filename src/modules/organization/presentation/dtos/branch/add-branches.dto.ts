import { OmitType } from '@nestjs/swagger';

import { BranchDto } from './branch.dto';

class AddBranchDto extends OmitType(BranchDto, ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']) {}

export class AddBranchesDto {
  branches: AddBranchDto[];
}
