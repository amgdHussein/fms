import { OmitType, PartialType } from '@nestjs/swagger';

import { BranchDto } from './branch.dto';

export class UpdateBranchDto extends PartialType(OmitType(BranchDto, ['id', 'organizationId', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])) {}
