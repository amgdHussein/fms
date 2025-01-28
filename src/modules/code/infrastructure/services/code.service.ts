import { Inject, Injectable, Logger } from '@nestjs/common';

import * as moment from 'moment-timezone';

import { Authority } from '../../../../core/common';
import { ETA_COMMON_PROVIDER } from '../../../../core/constants';
import { QueryFilter } from '../../../../core/models';
import { EgsCodeUsage, EtaCodeType, EtaCommonService } from '../../../../core/providers/eta';
import { Utils } from '../../../../core/utils';

import { IOrganizationTaxService, ORGANIZATION_TAX_SERVICE_PROVIDER, OrganizationTax } from '../../../organization/domain';
import { AuthorityCodeStatus, Code, CODE_REPOSITORY_PROVIDER, CodeStatus, CodeType, ICodeRepository, ICodeService } from '../../domain';

@Injectable()
export class CodeService implements ICodeService {
  private readonly logger: Logger = new Logger(CodeService.name);

  constructor(
    @Inject(ETA_COMMON_PROVIDER)
    private readonly etaCommon: EtaCommonService,

    @Inject(CODE_REPOSITORY_PROVIDER)
    private readonly codeRepo: ICodeRepository,

    @Inject(ORGANIZATION_TAX_SERVICE_PROVIDER)
    private readonly orgTaxService: IOrganizationTaxService,
  ) {}

  async getCodes(organizationId: string, filters?: QueryFilter[]): Promise<Code[]> {
    return this.codeRepo.getMany(organizationId, [...filters, { key: 'status', op: 'neq', value: CodeStatus.INACTIVE }]);
  }

  async getCode(id: string, organizationId: string): Promise<Code> {
    return this.codeRepo.get(id, organizationId);
  }

  async addCode(code: Partial<Code> & { authority: Authority; organizationId: string }): Promise<Code> {
    code.status = CodeStatus.ACTIVE;
    code.authorityStatus = AuthorityCodeStatus.SUBMITTED;
    code.type = CodeType.NEW;

    return this.addCodes([code], code.authority, code.organizationId).then(codes => codes[0]);
  }

  async draftCode(code: Partial<Code> & { organizationId: string }): Promise<Code> {
    code.status = CodeStatus.DRAFT;
    code.type = CodeType.NEW;

    return this.codeRepo.add(code, code.organizationId);
  }

  async addCodes(codes: Partial<Code>[], authority: Authority, organizationId: string): Promise<Code[]> {
    const orgTax: OrganizationTax = await this.orgTaxService.getTax(organizationId);

    switch (authority) {
      case Authority.ETA: {
        const authorityCodeType: EtaCodeType = EtaCodeType.EGS;

        const etaCodes: EgsCodeUsage[] = codes.map(code => {
          const { code: itemCode, name, nameAr, description, descriptionAr, activeAt, expireAt, linkedCode, nationalCode, comment: requestReason } = code;
          return {
            codeType: authorityCodeType,
            parentCode: nationalCode,
            itemCode,
            codeName: name,
            codeNameAr: nameAr,
            activeFrom: new Date(activeAt).toISOString(),
            activeTo: expireAt ? new Date(expireAt).toISOString() : null,
            description,
            descriptionAr,
            requestReason,
            linkedCode,
          };
        });

        // Summit to ETA
        const credential = { clientId: orgTax.clientId, clientSecret: orgTax.clientSecret };
        const { passedItems, failedItems } = await this.etaCommon.addCodes(etaCodes, credential, organizationId);

        // Get passed and failed items
        const passedItemCodes = passedItems.map(item => item.itemCode);
        const failedItemCodes = failedItems.map(item => item.itemCode);

        // Map codes and inform client-side with success/failure
        const passedCodes = passedItemCodes.map(itemCode => {
          const code = codes.find(codeData => codeData.code === itemCode);
          code.authority = authority;
          code.organizationId = organizationId;
          code.status = CodeStatus.ACTIVE;
          code.type = CodeType.NEW;
          code.authorityStatus = AuthorityCodeStatus.SUBMITTED;

          return code;
        });

        const failedCodes = failedItemCodes.map(itemCode => {
          const code = codes.find(codeData => codeData.code === itemCode);
          code.authority = authority;
          code.organizationId = organizationId;
          code.status = CodeStatus.DRAFT;
          code.type = CodeType.NEW;
          code.authorityStatus = AuthorityCodeStatus.FAILED;
          code.cause = failedItems.find(item => item.itemCode === itemCode).errors.join(', ');

          return code;
        });

        // If there are passed codes, add them to the database and return the codes
        if (passedCodes.length) {
          const data = await this.codeRepo.addMany(passedCodes, organizationId);
          // TODO: ADD TO QUEUE TO UPDATE CODE STATUS
          return [...data, ...failedCodes] as Code[];
        }

        return failedCodes as Code[];
      }
    }
  }

  async updateCode(code: Partial<Code> & { id: string; authority: Authority; organizationId: string }): Promise<Code> {
    const organizationId = code.organizationId;
    const authority = code.authority;

    const orgTax: OrganizationTax = await this.orgTaxService.getTax(organizationId);

    switch (authority) {
      case Authority.ETA: {
        const credential = { clientId: orgTax.clientId, clientSecret: orgTax.clientSecret };

        const { description, descriptionAr, expireAt, linkedCode, code: itemCode } = code;
        const publishedCode = {
          codeDescriptionPrimaryLang: description,
          codeDescriptionSecondaryLang: descriptionAr,
          activeTo: expireAt ? new Date(expireAt).toISOString() : null,
          linkedCode,
        };

        await this.etaCommon.updateCode(code.authorityCodeType, itemCode, publishedCode, credential, organizationId);
      }
    }

    return this.codeRepo.update(code, organizationId);
  }

  async reuseCodes(codes: Partial<Code>[], authority: Authority, organizationId: string): Promise<Code[]> {
    const orgTax: OrganizationTax = await this.orgTaxService.getTax(organizationId);

    switch (authority) {
      case Authority.ETA: {
        const etaCodes = codes.map(code => {
          const { code: itemCode, authorityCodeType: codeType, comment } = code;
          return { itemCode, codeType, comment };
        });

        const credential = { clientId: orgTax.clientId, clientSecret: orgTax.clientSecret };
        const { passedItems, failedItems } = await this.etaCommon.reuseCodes(etaCodes, credential, organizationId);

        const passedCodes = [];
        const failedCodes = codes.filter(code => failedItems.find(item => item.itemCode === code.code));

        for (const passItem of passedItems) {
          const code = codes.find(item => item.code === passItem.itemCode);

          const publishedCode = await this.etaCommon
            .getCodes(credential, organizationId, code.authorityCodeType, {
              CodeLookupValue: passItem.itemCode,
              PageNumber: 1,
              PageSize: 1,
              TaxpayerRIN: '',
            })
            .then(items => items[0])
            .catch(err => {
              this.logger.error(`Failed to get published code, ${err}`);
            });

          if (!publishedCode) {
            failedCodes.push(code);
            continue;
          }

          // Update code with published code data
          passedCodes.push({
            authority,
            organizationId,
            status: CodeStatus.ACTIVE,
            authorityStatus: AuthorityCodeStatus.SUBMITTED,
            type: CodeType.REUSED,

            name: publishedCode.codeNamePrimaryLang,
            nameAr: publishedCode.codeNameSecondaryLang,
            description: publishedCode.codeDescriptionPrimaryLang,
            descriptionAr: publishedCode.codeDescriptionSecondaryLang,

            activeAt: moment(publishedCode.activeFrom).valueOf(),
            expireAt: moment(publishedCode.activeTo).valueOf(),
            nationalCode: publishedCode.parentCodeLookupValue,
            linkedCode: publishedCode.linkedCode,
          });

          await Utils.Datetime.delay(10000);
        }

        // Init failed codes data
        failedCodes.forEach(code => {
          code.authority = authority;
          code.organizationId = organizationId;
          code.status = CodeStatus.DRAFT;
          code.type = CodeType.NEW;
          code.authorityStatus = AuthorityCodeStatus.FAILED;
          code.cause = failedItems.find(item => item.itemCode === item.itemCode).errors.join(', ');
        });

        // If there are passed codes, add them to the database and return the codes
        if (passedCodes.length) {
          const data = await this.codeRepo.addMany(passedCodes, organizationId);
          // TODO: ADD TO QUEUE TO UPDATE CODE STATUS
          return [...data, ...failedCodes] as Code[];
        }

        return failedCodes as Code[];
      }
    }
  }

  async importCodes(authority: Authority, organizationId: string): Promise<Code[]> {
    const codes = await this.codeRepo.getMany(organizationId, [{ key: 'authority', op: 'eq', value: authority }]);

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
