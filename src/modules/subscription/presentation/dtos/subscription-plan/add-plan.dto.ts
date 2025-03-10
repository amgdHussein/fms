import { OmitType } from '@nestjs/swagger';

import { PlanDto } from './plan.dto';

export class AddPlanDto extends OmitType(PlanDto, ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']) {}
