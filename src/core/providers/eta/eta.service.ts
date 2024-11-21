import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { AxiosHeaders, RawAxiosRequestHeaders } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';

import * as crypto from 'crypto';
import * as https from 'https';

import { ETA_CONFIGS_PROVIDER, HTTP_PROVIDER, REDIS_PROVIDER } from '../../constants';
import { BadRequestException } from '../../exceptions';

import { RedisService } from '../redis';

import { EtaAccessToken, EtaCredentials } from './entities';
import { EtaConfigs } from './eta.config';

@Injectable()
export class EtaService {
  private readonly logger = new Logger(EtaService.name);

  constructor(
    @Inject(ETA_CONFIGS_PROVIDER)
    private readonly configs: EtaConfigs,

    @Inject(HTTP_PROVIDER)
    private readonly http: HttpService,

    @Inject(REDIS_PROVIDER)
    private readonly redis: RedisService,
  ) {}

  async login(credential: EtaCredentials, organizationId: string): Promise<AxiosHeaders | RawAxiosRequestHeaders> {
    let token = await this.redis.get(`eta-token-${organizationId}`);

    if (!token) {
      const url = this.configs.apiTokenUrl;

      const header = {
        'Api-Version': 'alpha',
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const body = {
        grant_type: 'client_credential',
        client_id: credential.clientId,
        client_secret: credential.clientSecret,
      };

      const response = await firstValueFrom(
        this.http
          .post<EtaAccessToken>(url, body, {
            headers: header,
            httpsAgent: new https.Agent({ secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT }),
          })
          .pipe(
            map(response => response.data as EtaAccessToken),
            catchError(error => {
              this.logger.error(`EtaService ~ Login Error:${error}`);
              throw new BadRequestException('Invalid eta token credential!');
            }),
          ),
      );

      token = response.access_token;
      await this.redis.set(`eta-token-${organizationId}`, response.access_token, response.expires_in);
    }

    return {
      'Api-Version': 'alpha',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }
}
