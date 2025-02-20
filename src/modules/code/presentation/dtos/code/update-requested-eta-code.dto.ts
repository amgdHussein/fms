import { PartialType, PickType } from '@nestjs/swagger';

import { CodeDto } from './code.dto';

// TODO: FILL THE DTO

// all this required and the rest is optional
// itemCode	String	Code that was registered by the taxpayer	EG-113317713-1234
// codeName	String	Code name in English	water bottle
// codeNameAr	String	Code name in Arabic	قارورة مياه
// activeFrom	Date	Refer to the code start validity date in UTC	2021-03-21T00:00:00Z
// requestId?: number; // (codeUsageRequestId) EGS Code Usage Request ID

//! Note:  else others are optional but will be updated as empty

export class UpdateRequestedETACodeDto extends PartialType(PickType(CodeDto, ['description', 'descriptionAr', 'expireAt'])) {
  linkedCode?: string;
  requestId: number;
}
