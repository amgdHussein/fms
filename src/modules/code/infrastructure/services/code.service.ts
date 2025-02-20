import { Inject, Injectable, Logger } from '@nestjs/common';

import * as moment from 'moment-timezone';

import { Authority } from '../../../../core/common';
import { ETA_COMMON_PROVIDER } from '../../../../core/constants';
import { QueryFilter } from '../../../../core/models';
import { CodeUsage, EgsCodeUsage, EtaCodeType, EtaCommonService, EtaCredentials } from '../../../../core/providers/eta';
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

  //TODO: FIX THIS ([{ key: 'status', operator: 'neq', value: CodeStatus.INACTIVE }]) and add pagination
  async getCodes(organizationId: string, filters?: QueryFilter[]): Promise<Code[]> {
    // return this.codeRepo.getMany(organizationId, [{ key: 'status', operator: 'neq', value: CodeStatus.INACTIVE }]);
    return this.codeRepo.getMany(organizationId);
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
    console.log('incoming codes', codes);

    switch (authority) {
      case Authority.ETA: {
        const authorityCodeType: EtaCodeType = EtaCodeType.EGS;

        const etaCodes: EgsCodeUsage[] = codes.map(code => {
          const { code: itemCode, name, nameAr, description, descriptionAr, activeAt, expireAt, linkedCode, internationalCode, comment: requestReason } = code;
          return {
            codeType: authorityCodeType,
            parentCode: internationalCode,
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
        const credential = { clientId: orgTax.eInvoiceCredentials.clientId, clientSecret: orgTax.eInvoiceCredentials.clientSecret };
        const { passedItems, failedItems } = await this.etaCommon.addCodes(etaCodes, credential, organizationId);

        // Get passed and failed items
        // const passedItemCodes = passedItems.map(item => item.itemCode);
        // console.log('passedItemCodes', passedItemCodes);

        // const failedItemCodes = failedItems.map(item => item.itemCode); //TODO:FIX
        const failedItemCodes = failedItems.map(item => codes.at(item.index)); //TODO:FIX
        console.log('failedItemCodes', failedItemCodes);

        // Map codes and inform client-side with success/failure
        const passedCodes = passedItems.map(passItem => {
          const code = codes.find(codeData => codeData.code === passItem.itemCode);
          code.authority = authority;
          code.organizationId = organizationId;
          code.status = CodeStatus.ACTIVE;
          code.type = CodeType.NEW;
          code.authorityStatus = AuthorityCodeStatus.SUBMITTED;
          code.requestId = passItem.codeUsageRequestId;

          return code;
        });

        console.log('passedCodes', passedCodes);

        // Init failed codes data
        for (let i = 0; i < failedItemCodes.length; i++) {
          const failCode = failedItemCodes[i];
          const code = codes.find(codeData => codeData.code === failCode.code);
          code.authority = authority;
          code.organizationId = organizationId;
          code.status = CodeStatus.DRAFT;
          code.type = CodeType.NEW;
          code.authorityStatus = AuthorityCodeStatus.FAILED;
          // code.cause = failedItems.find(item => item.itemCode === itemCode).errors.join(', '); //TODO: FIX
          code.cause = failedItems.at(i).errors.join(', ');
        }

        console.log('failedCodes', failedItemCodes);

        // If there are passed codes, add them to the database and return the codes
        if (passedCodes.length) {
          const data = await this.codeRepo.addMany(passedCodes, organizationId);
          // TODO: ADD TO QUEUE TO UPDATE CODE STATUS
          return [...data, ...failedItemCodes] as Code[];
        }

        return failedItemCodes as Code[]; //TODO: HOW FRONTEND WILL HANDLE THIS AS HE DON'T KNOW THAT THIS IS FAILED
      }
    }
  }

  async updateCode(code: Partial<Code> & { id: string; authority: Authority; organizationId: string }): Promise<Code> {
    const organizationId = code.organizationId;
    const authority = code.authority;

    console.log('code', code);

    const orgTax: OrganizationTax = await this.orgTaxService.getTax(organizationId);

    switch (authority) {
      case Authority.ETA: {
        const credential = { clientId: orgTax.eInvoiceCredentials.clientId, clientSecret: orgTax.eInvoiceCredentials.clientSecret };

        const { description, descriptionAr, expireAt, linkedCode, code: itemCode } = code;
        const publishedCode = {
          codeDescriptionPrimaryLang: description,
          codeDescriptionSecondaryLang: descriptionAr,
          activeTo: expireAt ? new Date(expireAt).toISOString() : null,
          linkedCode,
        };

        console.log('publishedCode', publishedCode);

        await this.etaCommon.updateCode(code.authorityCodeType, itemCode, publishedCode, credential, organizationId);
      }
    }

    return this.codeRepo.update(code, organizationId);
  }

  async updateRequestedCode(code: Partial<Code> & { id: string; authority: Authority; organizationId: string; requestId: string }): Promise<Code> {
    const organizationId = code.organizationId;
    const authority = code.authority;
    const codeUsageRequestId = code.requestId;

    console.log('code', code);

    const orgTax: OrganizationTax = await this.orgTaxService.getTax(organizationId);

    switch (authority) {
      case Authority.ETA: {
        const credential = { clientId: orgTax.eInvoiceCredentials.clientId, clientSecret: orgTax.eInvoiceCredentials.clientSecret };

        const { code: itemCode, name, nameAr, description, descriptionAr, activeAt, expireAt, linkedCode, internationalCode, comment: requestReason } = code;

        console.log('basic code: ', code.code);
        console.log('itemCode:  ', itemCode);

        const etaCode: Omit<EgsCodeUsage, 'codeType'> = {
          parentCode: internationalCode,
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

        console.log('etaCode', etaCode);

        //TODO: MAKE SURE THAT IF ERROR NOT UPDATE BELOW
        const res = await this.etaCommon.updateEgsCodeRequest(codeUsageRequestId, etaCode, credential, organizationId);
        console.log('res', res);
      }
    }

    return this.codeRepo.update(code, organizationId);
  }

  //TODO: WE CAN USE THIS TO DOUBLE CHECK WITH INDEX IN REUSE CODES
  extractCodeFromErrorMessage(errorMessage: string): string | null {
    // Regular expression to match the code pattern (assuming codes are in single quotes)
    const codeRegex = /'([^']+)'/;

    // Try to match the code in the error message
    const match = errorMessage.match(codeRegex);

    // Return the code if found, otherwise return null
    return match ? match[1] : null;
  }

  async reuseCodes(codes: Partial<Code>[], authority: Authority, organizationId: string): Promise<Code[]> {
    const orgTax: OrganizationTax = await this.orgTaxService.getTax(organizationId);
    console.log('codes', codes);

    switch (authority) {
      case Authority.ETA: {
        const etaCodes = codes.map(code => {
          const { code: itemCode, authorityCodeType: codeType, comment } = code;
          return { itemCode, codeType, comment };
        });

        console.log('etaCodes', etaCodes);

        const credential = { clientId: orgTax.eInvoiceCredentials.clientId, clientSecret: orgTax.eInvoiceCredentials.clientSecret };
        const { passedItems, failedItems } = await this.etaCommon.reuseCodes(etaCodes, credential, organizationId);
        // {
        //   "passedItemsCount": 1,
        //   "failedItems": [],
        //   "passedItems": [
        //     {
        //       "itemCode": "EG-305276964-zsa5485da4",
        //       "codeUsageRequestId": 4429704
        //     }
        //   ]
        // }

        const passedCodes: Partial<Code>[] = [];

        const failedCodes = failedItems.map(item => {
          return codes.at(item.index); // extractCodeFromErrorMessage(item.errors.join(', '));
        });
        // failedItems [
        //   {
        //     index: 0,
        //     errors: [ errors examples
        //       "No need to create code usage for code 'EG-759939411-23001003' because this taxpayer already can use it"
        //        "Couldn't find code '0000080930303' to be reused" // sent as egs code
        //        'Item code [000008093030315] is not found in GS1 EG item codes'
        //         "There is a pending code usage  request for this item code 'EG-759939411-60003003'"

        //        if empty
        //        'Code value is required',
        //        'Code value length is between 1 and 250'

        //     ]
        //   }
        // ]

        console.log('eta response ', passedItems, failedItems);

        if (passedItems.length) {
          for (const passItem of passedItems) {
            const code = codes.find(item => item.code === passItem.itemCode);

            let publishedCode: CodeUsage = null;

            if (code.authorityCodeType === EtaCodeType.EGS) {
              publishedCode = await this.etaCommon
                .queryCodesRequests(
                  {
                    ItemCode: passItem.itemCode,
                    PageNumber: 1,
                    PageSize: 1,
                    // TaxpayerRIN: orgTax.taxIdNo, //TODO: NOT EXIST HERE
                    RequestType: 'Reusage',
                    Status: 'Submitted',
                  },
                  credential,
                  organizationId,
                )
                .then(items => items.at(0))
                .catch(err => {
                  this.logger.error(`Failed to get published egs code, ${err}`);
                  //TODO: THINK OF THROW ERROR OR NOT
                  throw new Error('Failed to get published egs code');
                });
            } else {
              // GS1
              publishedCode = await this.etaCommon
                .getCodes(credential, organizationId, code.authorityCodeType, {
                  CodeLookupValue: passItem.itemCode,
                  PageNumber: 1,
                  PageSize: 1,
                  TaxpayerRIN: orgTax.taxIdNo,
                })
                .then(items => items.result.at(0))
                .catch(err => {
                  this.logger.error(`Failed to get published gs1 code, ${err}`);
                  //TODO: THINK OF THROW ERROR OR NOT
                  throw new Error('Failed to get published egs code');
                });
            }

            if (!publishedCode) {
              failedCodes.push(code);
              continue;
            }

            // Update code with published code data
            passedCodes.push({
              organizationId,

              status: publishedCode.active ? CodeStatus.ACTIVE : CodeStatus.INACTIVE,
              type: CodeType.REUSED,

              authority,
              code: code.authorityCodeType === EtaCodeType.EGS ? publishedCode.itemCode : publishedCode.codeLookupValue,

              activeAt: moment(publishedCode.activeFrom).valueOf(), // i.e of activeFrom: "2024-10-10T18:56:57.288Z",
              expireAt: moment(publishedCode.activeTo).valueOf(),
              authorityStatus: code.authorityCodeType === EtaCodeType.EGS ? AuthorityCodeStatus.SUBMITTED : AuthorityCodeStatus.APPROVED,

              name: publishedCode.codeNamePrimaryLang,
              nameAr: publishedCode.codeNameSecondaryLang,
              description: code.authorityCodeType === EtaCodeType.EGS ? publishedCode.descriptionPrimaryLang : publishedCode.codeDescriptionPrimaryLang,
              descriptionAr: code.authorityCodeType === EtaCodeType.EGS ? publishedCode.descriptionSecondaryLang : publishedCode.codeDescriptionSecondaryLang,

              category: publishedCode.parentCodeNamePrimaryLang,

              linkedCode: publishedCode.linkedCode,
              internationalCode: code.authorityCodeType === EtaCodeType.EGS ? publishedCode.parentItemCode : publishedCode.parentCodeLookupValue,
              authorityCodeType: code.authorityCodeType,
              requestId: code.authorityCodeType === EtaCodeType.EGS ? passItem.codeUsageRequestId : null,
            });

            await Utils.Datetime.delay(10000);
          }
        }

        // Init failed codes data
        for (let i = 0; i < failedCodes.length; i++) {
          const failCode = failedCodes[i];
          failCode.authority = authority;
          failCode.organizationId = organizationId;
          failCode.status = CodeStatus.DRAFT;
          failCode.type = CodeType.REUSED;
          failCode.authorityStatus = AuthorityCodeStatus.FAILED;
          failCode.cause = failedItems.at(i).errors.join(', ');
        }

        // If there are passed codes, add them to the database and return the codes
        if (passedCodes.length) {
          const data = await this.codeRepo.addMany(passedCodes, organizationId);
          // TODO: ADD TO QUEUE TO UPDATE CODE STATUS EVERY 12 HOURS until 2 days
          return [...data, ...failedCodes] as Code[]; //TODO: HOW FRONTEND WILL HANDLE THIS AS HE DON'T KNOW FAILED FROM PASSED
        }

        // "There is a pending code usage  request for this item code 'EG-759939411-60003003'"
        return failedCodes as Code[]; //TODO: HOW FRONTEND WILL HANDLE THIS AS HE DON'T KNOW THAT THIS IS FAILED
      }
    }
  }

  //TODO: CHECK THIS METHOD
  // This method used when a new user want to sync his codes on the portal and then the button disappear in the ui
  async importCodes(authority: Authority, organizationId: string): Promise<Code[]> {
    console.log('importCodes', authority, organizationId);

    // const codes = await this.codeRepo.getMany(organizationId, [
    //   { key: 'authority', operator: 'eq', value: authority },
    //   { key: 'organizationId', operator: 'eq', value: organizationId },
    // ]);
    // const codes = await this.getCodes(organizationId);

    // .getMany(organizationId, [
    //   { key: 'authority', operator: 'eq', value: authority },
    //   { key: 'organizationId', operator: 'eq', value: organizationId },
    // ]);

    // console.log('codes length', codes.length);

    // return;

    switch (authority) {
      case Authority.ETA: {
        // TODO: GET ORGANIZATION AUTHORITY CODES
        // TODO: MERGE CODES INTO ORGANIZATION DATABASE
        // TODO: ADD CODES IF DOESN'T EXIST OR UPDATE

        const orgTax: OrganizationTax = await this.orgTaxService.getTax(organizationId);
        const credential = { clientId: orgTax.eInvoiceCredentials.clientId, clientSecret: orgTax.eInvoiceCredentials.clientSecret };

        // const publishedCode = await this.etaCommon.getCodes(credential, organizationId, EtaCodeType.EGS, {
        //   PageNumber: 1,
        //   PageSize: 20,
        //   TaxpayerRIN: orgTax.taxIdNo,
        // });

        // console.log('publishedCode', publishedCode);

        // const test = await this.etaCommon.getCodes(credential, organizationId, EtaCodeType.EGS, {
        //   PageNumber: 1,
        //   PageSize: 10,
        //   TaxpayerRIN: orgTax.taxIdNo,
        // });

        // console.log('test', test.result.length);

        // return;

        const egsCodes = await this.fetchAllPublishedCodesFromEta(credential, EtaCodeType.EGS, organizationId, orgTax.taxIdNo);

        // Introduce a delay of 10 seconds because of eta rate limit
        await new Promise(resolve => setTimeout(resolve, 10000));
        const gs1Codes = await this.fetchAllPublishedCodesFromEta(credential, EtaCodeType.GS1, organizationId, orgTax.taxIdNo);

        const allCodes = egsCodes.concat(gs1Codes);

        console.log('allCodes length', allCodes.length);
        const mappedCodes: Partial<Code>[] = allCodes.map(etaCode => {
          console.log(etaCode.ownerTaxpayer?.rin ? 'none' : `found: ${etaCode.codeLookupValue}`);

          return {
            authority,
            organizationId,
            status: etaCode.active ? CodeStatus.ACTIVE : CodeStatus.INACTIVE,
            type: etaCode.ownerTaxpayer?.rin ? (etaCode.ownerTaxpayer?.rin === orgTax.taxIdNo ? CodeType.NEW : CodeType.REUSED) : null, //TODO: SOME CODES ARE NOT HAVE RIN MAYBE WE CAN ASSUME THAT THIS IS INVALID REUSE
            code: etaCode.codeLookupValue,

            name: etaCode.codeNamePrimaryLang,
            nameAr: etaCode.codeNameSecondaryLang,
            description: etaCode.codeDescriptionPrimaryLang,
            descriptionAr: etaCode.codeDescriptionSecondaryLang,

            activeAt: moment(etaCode.activeFrom).valueOf(),
            expireAt: moment(etaCode.activeTo).valueOf(),
            authorityStatus: AuthorityCodeStatus.APPROVED,

            category: etaCode.parentCodeNamePrimaryLang,

            internationalCode: etaCode.parentCodeLookupValue,
            linkedCode: etaCode.linkedCode,
            authorityCodeType: this.convertCodeNameToEtaCodeType(etaCode.codeTypeNamePrimaryLang),
          };
        });
        // return;
        // TODO: I REMOVED THE below FILTER BECAUSE THIS WILL RUN WHEN THE USER HAVE NO CODES AT ALL
        //  drop any existing codes that are in the db
        // const filteredUniquesCodes = mappedCodes.filter(code => !codes.some(oldCode => oldCode.code === code.code));
        // const filteredExistingCodes = mappedCodes.filter(code => codes.some(oldCode => oldCode.code === code.code));
        //console.log('filteredExistingCodes', filteredExistingCodes.length);

        // const addedCodes = await this.repository.addCodes(filteredUniquesCodes);
        const addedCodes = await this.codeRepo.addMany(mappedCodes, organizationId);

        //TODO: HOW TO DETECT UPDATED OBJECTS TO UPDATE
        // const updatedCodes = await this.codeRepo.updateMany(filteredUniquesCodes, organizationId); //TODO: UPDATE EXISTINGS CODES
        console.log('bulkCodes', addedCodes.length);
        return addedCodes;
        break;
      }
    }

    // return codes;
  }

  convertCodeNameToEtaCodeType(codeName: string): EtaCodeType {
    switch (codeName) {
      case 'EGS':
        return EtaCodeType.EGS;
      case 'GS1':
        return EtaCodeType.GS1;
      default:
        return EtaCodeType.EGS;
    }
  }

  //TODO: CHECK THIS METHOD
  async fetchAllPublishedCodesFromEta(credential: EtaCredentials, codeType: EtaCodeType, organizationId: string, taxIdNo: string): Promise<CodeUsage[]> {
    const pageSize = 700; // !note that max page size is 900 as eta employee told me
    let pageNumber = 1;
    let totalPages = 0;
    const allCodes: CodeUsage[] = [];

    do {
      const publishedCode = await this.etaCommon.getCodes(credential, organizationId, codeType, {
        PageNumber: pageNumber,
        PageSize: pageSize,
        TaxpayerRIN: taxIdNo,
      });
      // .then(items => items)
      // .catch(err => {
      //   this.logger.error(`Failed to get published code, ${err}`);
      //   // TODO: THROW ANY ERROR
      //   // return { metadata: { totalPages: 0, totalCount: 0 }, result: [] };
      // });

      if (!totalPages) {
        const totalCount = publishedCode.metadata.totalCount;
        totalPages = Math.ceil(totalCount / pageSize);
      }

      pageNumber++;
      allCodes.push(...publishedCode.result);
    } while (pageNumber < totalPages);

    return allCodes;
  }
}
