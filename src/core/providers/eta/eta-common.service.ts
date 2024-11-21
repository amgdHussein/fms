import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';

import * as crypto from 'crypto';
import * as https from 'https';

import { ETA_CONFIGS_PROVIDER, ETA_PROVIDER, HTTP_PROVIDER } from '../../constants';

import { Utils } from '../../utils';
import { CodeUsage, EtaCodeType, EtaCredentials, QueryCodes } from './entities';
import { EtaConfigs } from './eta.config';
import { EtaService } from './eta.service';

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

  async getCodes(credential: EtaCredentials, codeType: EtaCodeType, query: QueryCodes): Promise<CodeUsage> {
    const header = await this.eta.login(credential, 'organizationId');

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { PageNumber, PageSize, ...newObj } = query;
    const queryProp = Utils.Tax.buildEtaQuery(newObj);

    const url = `${this.configs.apiVersionUrl}/codetypes/${codeType}/codes?Ps=${PageSize}&Pn=${PageNumber}${queryProp ? `&${queryProp}` : ''}`;

    const response = this.http
      .get<{ result: CodeUsage }>(url, {
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
}
