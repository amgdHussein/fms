import { PartialType, PickType } from '@nestjs/swagger';

import { CodeDto } from './code.dto';

// TODO: FILL THE DTO
export class UpdateETACodeDto extends PartialType(PickType(CodeDto, ['description', 'descriptionAr', 'expireAt'])) {
  linkedCode?: string;
}
