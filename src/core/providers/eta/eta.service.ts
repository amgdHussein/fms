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
import { EReceiptCredentials } from './temp-entity/receipt.entity';

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
    let token = await this.redis.get(`eta-invoice-token-${organizationId}`);

    if (!token) {
      const url = this.configs.apiTokenUrl;

      const header = {
        'Api-Version': 'alpha',
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const body = {
        grant_type: 'client_credentials',
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
      await this.redis.set(`eta-invoice-token-${organizationId}`, response.access_token, response.expires_in);
    }

    return {
      'Api-Version': 'alpha',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async authenticatePos(credential: EReceiptCredentials, organizationId: string): Promise<AxiosHeaders | RawAxiosRequestHeaders> {
    const posSerial = credential.pos.serialNo; //'TaxEgypt2024';
    let token = await this.redis.get(`eta-receipt-token-${organizationId}-${posSerial}`);

    console.log('token', token);
    console.log('condition ', !token);

    if (!token) {
      const url = this.configs.apiTokenUrl;

      const header = {
        'Api-Version': 'alpha',
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const body = {
        grant_type: 'client_credentials',
        client_id: credential.clientId,
        client_secret: credential.clientSecret,
      };

      const response = await firstValueFrom(
        this.http
          .post<EtaAccessToken>(url, body, {
            headers: {
              ...header,
              posserial: posSerial,
              pososversion: credential.pos.osVersion, //'os'
            },
            httpsAgent: new https.Agent({
              secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
            }),
          })
          .pipe(
            map(response => response.data as EtaAccessToken),
            catchError(error => {
              this.logger.error(`EtaService ~ authenticatePos Error:${error}`);
              throw new BadRequestException('Invalid pos eta token credential!');
            }),
          ),
      );

      console.log('set new token!!');

      token = response.access_token;
      await this.redis.set(`eta-receipt-token-${organizationId}-${posSerial}`, response.access_token, response.expires_in);
    }

    console.log('🚀 ~ authenticatePos end');
    return {
      'Api-Version': 'alpha',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }
}
