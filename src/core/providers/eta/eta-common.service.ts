import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';

import * as crypto from 'crypto';
import * as https from 'https';

import { ETA_CONFIGS_PROVIDER, ETA_PROVIDER, HTTP_PROVIDER } from '../../constants';
import { Utils } from '../../utils';

import { CodeUsage, EgsCodeUsage, EtaCodeType, EtaCredentials, QueryCodes } from './entities';
import { EtaConfigs } from './eta.config';
import { EtaService } from './eta.service';

interface PassedItem {
  itemCode: string;
  codeUsageRequestId: number;
}
interface FailedItem {
  itemCode: string;
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

  async getCodes(credential: EtaCredentials, organizationId: string, codeType: EtaCodeType, query: QueryCodes): Promise<CodeUsage[]> {
    const header = await this.eta.login(credential, organizationId);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { PageNumber, PageSize, ...newObj } = query;
    const queryProp = Utils.Eta.buildEtaQuery(newObj);

    const url = `${this.configs.apiVersionUrl}/codetypes/${codeType}/codes?Ps=${PageSize}&Pn=${PageNumber}${queryProp ? `&${queryProp}` : ''}`;

    const response = this.http
      .get<{ result: CodeUsage[] }>(url, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      })
      .pipe(
        map(response => response.data.result),
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
          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  // getEgsCodeUsageRequests
  async queryCodes(query: Partial<QueryCodes>, credential: EtaCredentials, organizationId: string): Promise<CodeUsage[]> {
    const header = await this.eta.login(credential, organizationId);

    const { PageNumber: page, PageSize: limit, ...filters } = query;
    const queryProp = Utils.Eta.buildEtaQuery(filters);
    const url = `${this.configs.apiVersionUrl}/codetypes/requests/my?PageSize=${limit || 1}&PageNumber=${page || 1}${queryProp ? `&${queryProp}` : ''}`;

    const response = this.http
      .get<{ result: CodeUsage[] }>(url, {
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
}
