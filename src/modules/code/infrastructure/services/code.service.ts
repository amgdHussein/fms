import { Inject, Injectable } from '@nestjs/common';

import { Authority } from '../../../../core/common';
import { EtaCodeType } from '../../../../core/providers/eta';
import { AuthorityCodeStatus, Code, CODE_REPOSITORY_PROVIDER, CodeStatus, CodeType, ICodeRepository, ICodeService } from '../../domain';

@Injectable()
export class CodeService implements ICodeService {
  constructor(
    @Inject(CODE_REPOSITORY_PROVIDER)
    private readonly repo: ICodeRepository,
  ) {}

  async getCode(id: string, organizationId: string): Promise<Code> {
    return this.repo.get(id, organizationId);
  }

  async addCode(code: Partial<Code> & { authority: Authority; organizationId: string }): Promise<Code> {
    code.status = CodeStatus.ACTIVE;
    code.authorityStatus = AuthorityCodeStatus.SUBMITTED;
    code.type = CodeType.NEW;

    return this.repo.add(code, code.organizationId);
  }

  async draftCode(code: Partial<Code> & { organizationId: string }): Promise<Code> {
    code.status = CodeStatus.DRAFT;
    code.type = CodeType.NEW;

    return this.repo.add(code, code.organizationId);
  }

  async updateCode(code: Partial<Code> & { id: string; authority: Authority; organizationId: string }): Promise<Code> {
    switch (code.authority) {
      case Authority.ETA: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { description, descriptionAr, expireAt, linkedCode } = code;
        // TODO: UPDATE CODE TO AUTHORITY
        break;
      }
    }

    return this.repo.update(code, code.organizationId);
  }

  async getCodes(organizationId: string): Promise<Code[]> {
    return this.repo.getMany(organizationId, [{ key: 'status', op: 'neq', value: 2 }]);
  }

  async addCodes(codes: Partial<Code>[], authority: Authority, organizationId: string): Promise<Code[]> {
    codes.forEach(code => {
      code.authority = authority;
      code.organizationId = organizationId;
      code.status = CodeStatus.ACTIVE;
      code.type = CodeType.NEW;
      code.authorityStatus = AuthorityCodeStatus.SUBMITTED;
    });

    return this.repo.addMany(codes, organizationId);

    switch (authority) {
      case Authority.ETA: {
        // TODO: MAP NATIVE CODE INTO ETA CODE

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const authorityCodeType: string = EtaCodeType.EGS;

        codes.map(code => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { code: authorityCode, name, nameAr, description, descriptionAr, activeAt, expireAt, linkedCode, nationalCode, comment: requestReason } = code;
        });

        // TODO: SUBMIT CODES TO AUTHORITY
        break;
      }
    }
  }

  async reuseCode(code: Partial<Code> & { authority: string; organizationId: string }): Promise<Code> {
    code.status = CodeStatus.ACTIVE;
    code.authorityStatus = AuthorityCodeStatus.SUBMITTED;
    code.type = CodeType.REUSED;

    switch (code.authority) {
      case Authority.ETA: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { code: authorityCode, authorityCodeType, comment: requestReason } = code;
        // TODO: SUBMIT CODES TO AUTHORITY
        // TODO: UPDATE NATIVE CODE WITH AUTHORITY DATA
        break;
      }
    }

    return this.repo.add(code, code.organizationId);
  }

  async importCodes(authority: Authority, organizationId: string): Promise<Code[]> {
    const codes = await this.repo.getMany(organizationId, [{ key: 'authority', op: 'eq', value: authority }]);

    switch (authority) {
      case Authority.ETA: {
        // TODO: GET ORGANIZATION AUTHORITY CODES
        // TODO: MERGE CODES INTO ORGANIZATION DATABASE
        // TODO: ADD CODES IF DOESN'T EXIST OR UPDATE
        break;
      }
    }

    return codes;
  }
}
