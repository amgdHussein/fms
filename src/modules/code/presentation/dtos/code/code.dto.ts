import { Authority } from '../../../../../core/enums';
import { AuthorityCodeStatus, Code, CodeStatus, CodeType } from '../../../domain';

// TODO: FILL THE DTO
export class CodeDto implements Code {
  id: string;
  organizationId: string; // Required
  status: CodeStatus;
  type: CodeType;
  authority: Authority; // Required
  code: string; // Required
  activeAt: number; // Required
  expireAt?: number;
  authorityStatus: AuthorityCodeStatus;

  name: string; // Required
  description: string;
  nameAr?: string; // Required
  descriptionAr?: string;
  category: string;
  comment?: string;

  // Swagger properties
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
