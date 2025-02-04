import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as https from 'https';
import { catchError, firstValueFrom, map } from 'rxjs';
import { ETA_CONFIGS_PROVIDER, ETA_PROVIDER, HTTP_PROVIDER } from '../../constants';
import { EtaConfigs } from './eta.config';
import { EtaService } from './eta.service';
import { SearchReceiptSubmissionQuery, SearchReceiptSubmissionResponse } from './temp-entity';
import { ReceiptDetails } from './temp-entity/receipt-details.entity';
import { ReceiptExtended } from './temp-entity/receipt-extended.entity';
import { EReceiptCredentials, EtaReceipt } from './temp-entity/receipt.entity';
import { SearchReceiptQuery, SearchReceiptResponse } from './temp-entity/search-receipt.entity';
import { SetReceiptsResponse } from './temp-entity/set-receipt-response.entity';

function queryString(obj: any): string {
  return (
    Object.entries(obj)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (value) {
          return `${key}=${encodeURIComponent(value.toString())}`;
        }
        return '';
      })
      .join('&')
  );
}

@Injectable()
export class EtaEReceiptService {
  private readonly logger = new Logger(EtaEReceiptService.name);

  constructor(
    @Inject(ETA_PROVIDER)
    private readonly eta: EtaService,

    @Inject(ETA_CONFIGS_PROVIDER)
    private readonly configs: EtaConfigs,

    @Inject(HTTP_PROVIDER)
    private readonly httpService: HttpService,
  ) {}

  // async submitReceiptDocuments(receipts: EtaReceipt[], credentials?: EReceiptCredentials): Promise<any> {
  async submitReceiptDocuments(receipts: EtaReceipt, credential: EReceiptCredentials, organizationId: string): Promise<SetReceiptsResponse> {
    const header = await this.eta.authenticatePos(credential, organizationId);
    const url = `${this.configs.apiVersionUrl}/receiptsubmissions`;
    console.log('url', url);

    const response = await firstValueFrom(
      this.httpService
        .post<SetReceiptsResponse>(
          url,
          { receipts: [receipts] },
          {
            headers: header,
            httpsAgent: new https.Agent({
              secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
            }),
          },
        )
        .pipe(
          map(response => response.data as SetReceiptsResponse),
          catchError(error => {
            console.log('error', error);

            throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(',') ?? error.response.data.error, error.response.status, {
              cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
            });
          }),
        ),
    );

    console.log('response', response);

    return response;
  }

  async getReceiptDetails(uuid: string, credential: EReceiptCredentials, organizationId: string): Promise<ReceiptDetails> {
    const header = await this.eta.authenticatePos(credential, organizationId);
    const url = `${this.configs.apiVersionUrl}/receipts/${uuid}/details`;

    const response = this.httpService
      .get<ReceiptDetails>(url, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      })
      .pipe(
        map(response => response.data as ReceiptDetails),
        catchError(error => {
          // this.logger.error(error);
          // throw new InternalServerErrorException('Something went wrong while getting document details!');

          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  // API allows taxpayers to retrieve receipt/return receipt source JSON with additional tax authority added metadata.
  async getReceipt(uuid: string, credential: EReceiptCredentials, organizationId: string): Promise<ReceiptExtended> {
    const header = await this.eta.authenticatePos(credential, organizationId);
    const url = `${this.configs.apiVersionUrl}/receipts/${uuid}/raw`;

    const response = this.httpService
      .get<ReceiptExtended>(url, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      })
      .pipe(
        map(response => response.data as ReceiptExtended),
        catchError(error => {
          // this.logger.error(error);
          // throw new InternalServerErrorException('Something went wrong while getting document details!');

          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  async getReceiptDetailsAnonymously(uuid: string, dateTimeIssued: string, credential: EReceiptCredentials, organizationId: string): Promise<ReceiptDetails> {
    const header = await this.eta.authenticatePos(credential, organizationId);
    const url = `${this.configs.apiVersionUrl}/receipts/${uuid}/share?dateTimeIssued=${dateTimeIssued}`;

    const response = this.httpService
      .get<ReceiptDetails>(url, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      })
      .pipe(
        map(response => response.data as ReceiptDetails),
        catchError(error => {
          // this.logger.error(error);
          // throw new InternalServerErrorException('Something went wrong while getting document details!');

          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  async getReceiptSubmission(
    submissionUuid: string,
    query: SearchReceiptSubmissionQuery,
    credential: EReceiptCredentials,
    organizationId: string,
  ): Promise<SearchReceiptSubmissionResponse> {
    const header = await this.eta.authenticatePos(credential, organizationId);

    const remainingQuery = queryString(query);
    const urlQuery = remainingQuery ? `${remainingQuery}` : '';
    const url = `${this.configs.apiVersionUrl}/receiptsubmissions/${submissionUuid}/details?${urlQuery}`;

    console.log('url', url);

    const response = this.httpService
      .get<SearchReceiptSubmissionResponse>(url, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      })
      .pipe(
        map(response => response.data as SearchReceiptSubmissionResponse),
        catchError(error => {
          this.logger.error(error);
          // throw new InternalServerErrorException('Something went wrong while getting documents!');

          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );
    return firstValueFrom(response);
  }

  // Receipts can be retrieved for fixed duration. Default period is 1 month which is configurable
  // The maximum number of receipts that can be returned by this API is 3,000 (configurable)
  async searchReceipts(query: SearchReceiptQuery, credential: EReceiptCredentials, organizationId: string): Promise<SearchReceiptResponse> {
    const header = await this.eta.authenticatePos(credential, organizationId);

    const remainingQuery = queryString(query);
    const urlQuery = remainingQuery ? `${remainingQuery}` : '';
    const url = `${this.configs.apiVersionUrl}/receipts/search?${urlQuery}`;

    const response = this.httpService
      .get<SearchReceiptResponse>(url, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      })
      .pipe(
        map(response => response.data as SearchReceiptResponse),
        catchError(error => {
          // this.logger.error(error);
          // throw new InternalServerErrorException('Something went wrong while getting documents!');

          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );
    return firstValueFrom(response);
  }

  // Receipts can be retrieved for fixed duration. Default period is 1 month which is configurable
  // The maximum number of receipts that can be returned by this API is 3,000 (configurable)
  // async getRecentReceipts(query: SearchRecentReceiptQuery, credential: EReceiptCredentials, organizationId: string): Promise<any> {
  //   //? IMPLEMENT IF NEEDED
  // }
}
