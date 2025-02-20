import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';

import * as crypto from 'crypto';
import * as https from 'https';

import { ETA_CONFIGS_PROVIDER, ETA_PROVIDER, HTTP_PROVIDER } from '../../constants';
import { Utils } from '../../utils';

import { CodeUsage, CodeUsageQuery, EgsCodeUsage, EtaCodeType, EtaCredentials, QueryCodes } from './entities';
import { EtaConfigs } from './eta.config';
import { EtaService } from './eta.service';

interface PassedItem {
  itemCode: string;
  codeUsageRequestId: number;
}
interface FailedItem {
  index: number;
  // itemCode: string;
  errors: string[];
}

interface CodeResponse {
  failedItems: FailedItem[];
  passedItems: PassedItem[];
}

interface ReusedCode {
  comment: string;
  itemCode: string;
  codeType: EtaCodeType;
}

@Injectable()
export class EtaCommonService {
  private readonly logger = new Logger(EtaCommonService.name);

  constructor(
    @Inject(ETA_CONFIGS_PROVIDER)
    private readonly configs: EtaConfigs,

    @Inject(ETA_PROVIDER)
    private readonly eta: EtaService,

    @Inject(HTTP_PROVIDER)
    private readonly http: HttpService,
  ) {}

  /**
   * Fetches a list of published code usages from the ETA service.
   *
   * @param {EtaCredentials} credential - The credentials required to authenticate with the ETA service.
   * @param {string} organizationId - The ID of the organization making the request.
   * @param {EtaCodeType} codeType - The type of code to query.
   * @param {QueryCodes} query - The query parameters for fetching codes, including pagination info.
   *
   * @returns {Promise<CodeUsageQuery>} - A promise that resolves to a CodeUsageQuery object containing the code usages.
   *
   * @throws {HttpException} - Throws an exception if the request fails, with details of the error.
   *
   * @example
   * {
   *   "codeID": 16481235,
   *   "codeLookupValue": "0000080930303",
   *   "codeNamePrimaryLang": "Loacker",
   *   "codeNameSecondaryLang": null,
   *   "codeDescriptionPrimaryLang": "Loacker --- Loacker Classic Vanilla 6 X 25 X 30Gr --- 30 Gram",
   *   "codeDescriptionSecondaryLang": "لواكر --- لواكر فانيليا 30 جم --- 30 Gram",
   *   "activeFrom": "2021-09-07T00:00:00Z",
   *   "activeTo": null,
   *   "parentCodeID": 6823,
   *   "parentCodeLookupValue": "10000045",
   *   "codeTypeID": 2,
   *   "codeTypeLevelID": 8,
   *   "codeTypeLevelNamePrimaryLang": "GPC Level 5 Code - GTIN",
   *   "codeTypeLevelNameSecondaryLang": "The lowest level in the GS1 Code. ",
   *   "parentCodeNamePrimaryLang": "Chocolate and Chocolate/Sugar Candy Combinations - Confectionery",
   *   "parentCodeNameSecondaryLang": "حلويات الشوكولاته / بدائل الشوكولاته",
   *   "parentLevelName": "GPC Level 4 Code - Brick",
   *   "codeTypeNamePrimaryLang": "GS1",
   *   "codeTypeNameSecondaryLang": "GS1",
   *   "active": true,
   *   "linkedCode": null,
   *   "codeCategorization": {
   *     "level1": {
   *       "id": 1797,
   *       "lookupValue": "50000000",
   *       "name": "Food/Beverage",
   *       "nameAr": "الأطعمة/المشروبات/التبغ"
   *     },
   *     "level2": {
   *       "id": 1852,
   *       "lookupValue": "50160000",
   *       "name": "Confectionery/Sugar Sweetening Products",
   *       "nameAr": "منتجات الحلويات/التحلية السكرية"
   *     },
   *     "level3": {
   *       "id": 2294,
   *       "lookupValue": "50161800",
   *       "name": "Confectionery Products",
   *       "nameAr": "منتجات الحلويات"
   *     },
   *     "level4": {
   *       "id": 6823,
   *       "lookupValue": "10000045",
   *       "name": "Chocolate and Chocolate/Sugar Candy Combinations - Confectionery",
   *       "nameAr": "حلويات الشوكولاته / بدائل الشوكولاته"
   *     }
   *   },
   *   "attributes": [],
   *   "ownerTaxpayer": null,
   *   "requesterTaxpayer": null
   * }
   */
  async getCodes(credential: EtaCredentials, organizationId: string, codeType: EtaCodeType, query: QueryCodes): Promise<CodeUsageQuery> {
    const header = await this.eta.login(credential, organizationId);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { PageNumber, PageSize, ...newObj } = query;
    const queryProp = Utils.Eta.buildEtaQuery(newObj);

    const url = `${this.configs.apiVersionUrl}/codetypes/${codeType}/codes?Ps=${PageSize}&Pn=${PageNumber}${queryProp ? `&${queryProp}` : ''}`;

    const response = this.http
      .get<CodeUsageQuery>(url, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      })
      .pipe(
        map(response => response.data),
        catchError(error => {
          this.logger.error(error);
          throw new HttpException(error.response?.data.error?.details?.map(err => err.message).join(','), error.response?.status, {
            cause: new Error(error.response?.data?.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  // setEgsCodeUsage
  async addCodes(codes: EgsCodeUsage[], credential: EtaCredentials, organizationId: string): Promise<CodeResponse> {
    const header = await this.eta.login(credential, organizationId);

    const url = `${this.configs.apiVersionUrl}/codetypes/requests/codes`;

    const response = this.http
      .post<CodeResponse>(
        url,
        { items: codes },
        {
          headers: header,
          httpsAgent: new https.Agent({
            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
          }),
        },
      )
      .pipe(
        map(response => response.data),
        catchError(error => {
          throw new HttpException(error.response?.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  // requestCodeReuse
  async reuseCodes(codes: ReusedCode[], credential: EtaCredentials, organizationId: string): Promise<CodeResponse> {
    const header = await this.eta.login(credential, organizationId);
    const url = `${this.configs.apiVersionUrl}/codetypes/requests/codeusages`;

    const response = this.http
      .put<CodeResponse>(
        url,
        { items: codes },
        {
          headers: header,
          httpsAgent: new https.Agent({
            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
          }),
        },
      )
      .pipe(
        map(response => response.data),
        catchError(error => {
          // throw new InternalServerErrorException('Something went wrong while updating code reuse!');
          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  // updatePublishedCodes
  async updateCode(codeType: EtaCodeType, itemCode: string, code: Partial<CodeUsage>, credential: EtaCredentials, organizationId: string): Promise<number> {
    const header = await this.eta.login(credential, organizationId);
    const url = `${this.configs.apiVersionUrl}/codetypes/${codeType}/codes/${itemCode}`;

    const publishedCode = {
      codeDescriptionPrimaryLang: code.codeDescriptionPrimaryLang,
      codeDescriptionSecondaryLang: code.codeDescriptionSecondaryLang,
      activeTo: code.activeTo,
      linkedCode: code.linkedCode,
    };

    console.log('eta body code', publishedCode);

    const response = this.http
      .put<number>(url, publishedCode, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      })
      .pipe(
        map(response => response.data as number),
        catchError(error => {
          // error="You don't have acces to update this code" cause="Error: CodeID"error="You don't have acces to update this code" cause="Error: CodeID"
          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  // getEgsCodeUsageRequests
  /**
   * @description Get EGS Code Usage Requests
   * @param {Partial<QueryCodes>} query - query object
   * @param {EtaCredentials} credential - eta credentials
   * @param {string} organizationId - organization id
   * @returns {Promise<CodeUsage[]>} - list of code usage
   * @example {
   * "codeUsageRequestID": 4426337,
   * "codeTypeName": "EGS",
   * "codeID": 212283534,
   * "itemCode": "EG-696411482-60002002",
   * "codeNamePrimaryLang": "paper",
   * "codeNameSecondaryLang": "اوراق",
   * "descriptionPrimaryLang": "",
   * "descriptionSecondaryLang": "",
   * "parentCodeID": 938414,
   * "parentItemCode": "10001138",
   * "parentCodeNamePrimaryLang": "Computer Software (Non Games)",
   * "parentCodeNameSecondaryLang": "(برامج الكمبيوتر (غير الألعاب",
   * "parentLevelName": "EGS Level 4 Code - Brick",
   * "levelName": "EGS Level 5 Code",
   * "requestCreationDateTimeUtc": "2025-02-18T06:41:22.2763889Z",
   * "codeCreationDateTimeUtc": "2024-10-13T09:11:13.6310432Z",
   * "activeFrom": "2024-10-10T18:56:57.288Z",
   * "activeTo": null,
   * "active": true,
   * "status": "Submitted",
   * "statusReason": null,
   * "ownerTaxpayer": {
   *   "rin": "696411482",
   *   "name": "تاكس اجيبت للتطبيقات",
   *   "nameAr": "تاكس اجيبت للتطبيقات"
   * },
   * "requesterTaxpayer": {
   *   "rin": "305276964",
   *   "name": "احمد احمد بيومي محمد",
   *   "nameAr": "احمد احمد بيومي محمد"
   * },
   * "codeCategorization": {
   *   "level1": {
   *     "id": 936974,
   *     "lookupValue": null,
   *     "name": "Computing",
   *     "nameAr": "الحوسبة"
   *   },
   *   "level2": {
   *     "id": 936988,
   *     "lookupValue": null,
   *     "name": "Computers/Video Games",
   *     "nameAr": "الكمبيوترات/أجهزة ألعاب الفيديو"
   *   },
   *   "level3": {
   *     "id": 937407,
   *     "lookupValue": null,
   *     "name": "Computer/Video Game Software",
   *     "nameAr": "برامج أجهزة الكمبيوتر/ألعاب الفيديو"
   *   },
   *   "level4": {
   *     "id": 938414,
   *     "lookupValue": null,
   *     "name": "Computer Software (Non Games)",
   *     "nameAr": "(برامج الكمبيوتر (غير الألعاب"
   *   }
   * }
   *
   */
  async queryCodesRequests(query: Partial<QueryCodes>, credential: EtaCredentials, organizationId: string): Promise<CodeUsage[]> {
    const header = await this.eta.login(credential, organizationId);

    const { PageNumber: page, PageSize: limit, ...filters } = query;
    const queryProp = Utils.Eta.buildEtaQuery(filters);
    const url = `${this.configs.apiVersionUrl}/codetypes/requests/my?PageSize=${limit || 1}&PageNumber=${page || 1}${queryProp ? `&${queryProp}` : ''}`;

    const response = this.http
      .get<CodeUsageQuery>(url, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      })
      .pipe(
        map(response => response.data.result),
        catchError(error => {
          // throw new InternalServerErrorException('Something went wrong while getting egs code usage requests!');
          throw new HttpException(error.response.data?.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data?.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  /**
   * @description Update EGS Code Usage Request
   * @param {number} codeUsageRequestId - EGS Code Usage Request ID
   * @param {EgsCodeUsage} code - EGS Code Usage Object
   * @param {EtaCredentials} credential - eta credentials
   * @param {string} organizationId - organization id
   * @returns {Promise<boolean>} - true if request is updated successfully
   */
  async updateEgsCodeRequest(
    codeUsageRequestId: number,
    code: Omit<EgsCodeUsage, 'codeType'>,
    credential: EtaCredentials,
    organizationId: string,
  ): Promise<boolean> {
    const header = await this.eta.login(credential, organizationId);
    const url = `${this.configs.apiVersionUrl}/codetypes/requests/codes/${codeUsageRequestId}`;

    console.log('eta body code', code);

    const response = this.http
      .put<boolean>(url, code, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      })
      .pipe(
        map(response => response.data as boolean),
        catchError(error => {
          // error example
          // {
          //   "error": {
          //     "code": "ValidationError",
          //     "message": null,
          //     "target": "UpdateCodeUsageCommandHandler",
          //     "details": [
          //       {
          //         "code": null,
          //         "target": "linkedCodeId",
          //         "message": "LinkedCodeID [EG-728466198-Yes] does not exist"
          //       }
          //     ]
          //   }
          // }
          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }
}
