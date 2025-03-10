import { OmitType, PartialType } from '@nestjs/swagger';

import { PlanDto } from './plan.dto';

export class UpdatePlanDto extends PartialType(OmitType(PlanDto, ['id', 'cycle', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])) {}
