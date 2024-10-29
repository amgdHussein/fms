import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { EtaCodeType } from '../../../../../core/providers/eta';

import { CodeDto } from './code.dto';

// TODO: FILL THE DTO
export class ReuseETACodeDto extends IntersectionType(PickType(CodeDto, ['id']), PartialType(PickType(CodeDto, ['code', 'comment']))) {
  authorityCodeType: EtaCodeType; // Required
}
