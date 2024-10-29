import { OmitType } from '@nestjs/swagger';

import { CodeDto } from './code.dto';

// TODO: FILL THE DTO
class AddETACodeDto extends OmitType(CodeDto, [
  'id',
  'organizationId',
  'status',
  'type',
  'authority',
  'authorityStatus',
  'category',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
]) {
  linkedCode?: string; // Optional
  nationalCode?: string; // Required
}

export class AddETACodesDto {
  codes: AddETACodeDto[];
}
