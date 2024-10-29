import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { CodeDto } from './code.dto';

// TODO: FILL THE DTO
export class UpdateETACodeDto extends IntersectionType(
  PickType(CodeDto, ['id']),
  PartialType(PickType(CodeDto, ['description', 'descriptionAr', 'expireAt'])),
) {
  linkedCode?: string;
}
