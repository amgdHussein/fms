import { Authority } from '../../../../core/common';

import { Code } from '../entities';

export interface ICodeService {
  getCode(id: string, organizationId: string): Promise<Code>;
  getCodes(organizationId: string): Promise<Code[]>;
  draftCode(code: Partial<Code> & { organizationId: string }): Promise<Code>;
  importCodes(authority: Authority, organizationId: string): Promise<Code[]>;
  addCode(code: Partial<Code> & { authority: Authority; organizationId: string }): Promise<Code>;
  addCodes(codes: Partial<Code>[], authority: Authority, organizationId: string): Promise<Code[]>;
  updateCode(code: Partial<Code> & { id: string; authority: Authority; organizationId: string }): Promise<Code>;
  reuseCodes(codes: Partial<Code>[], authority: Authority, organizationId: string): Promise<Code[]>;
}
