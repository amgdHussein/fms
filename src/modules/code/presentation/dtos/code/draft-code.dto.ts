import { OmitType, PartialType } from '@nestjs/swagger';

import { CodeDto } from './code.dto';

export class DraftCodeDto extends OmitType(PartialType(CodeDto), [
  'id',
  'organizationId',
  'status',
  'type',
  'authorityStatus',
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
]) {}
