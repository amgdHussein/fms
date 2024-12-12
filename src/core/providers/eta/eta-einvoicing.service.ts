import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';

import * as crypto from 'crypto';
import * as https from 'https';

import { ETA_CONFIGS_PROVIDER, ETA_PROVIDER, HTTP_PROVIDER } from '../../constants';
import { Utils } from '../../utils';

import { AddEtaInvoice, EtaCredentials, EtaInvoice, InvoiceQueryResult, QueryInvoices } from './entities';
import { EtaConfigs } from './eta.config';
import { EtaService } from './eta.service';

type DocumentAccepted = { uuid: string; longId: string; internalId: string; hashKey: string };
type DocumentRejected = {
  internalId?: string;
  error?: { code?: string; message?: string; target?: string; propertyPath?: any; details?: any[] };
  // TODO: check type in real test
};

@Injectable()
export class EtaEInvoicingService {
  private readonly logger = new Logger(EtaEInvoicingService.name);

  constructor(
    @Inject(ETA_PROVIDER)
    private readonly eta: EtaService,

    @Inject(ETA_CONFIGS_PROVIDER)
    private readonly configs: EtaConfigs,

    @Inject(HTTP_PROVIDER)
    private readonly http: HttpService,
  ) {}

  async getInvoice(uuid: string, credential: EtaCredentials, organizationId: string): Promise<EtaInvoice> {
    const header = await this.eta.login(credential, organizationId);

    const url = `${this.configs.apiVersionUrl}/documents/${uuid}/details`;

    const response = this.http
      .get<EtaInvoice>(url, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      })
      .pipe(
        map(response => response.data),
        catchError(error => {
          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  async addInvoices(invoices: AddEtaInvoice[], credential: EtaCredentials, organizationId: string): Promise<DocumentAccepted[]> {
    const header = await this.eta.login(credential, organizationId);
    const url = `${this.configs.apiVersionUrl}/documentsubmissions`;

    const response = this.http
      .post<{ submissionId: string; acceptedDocuments: DocumentAccepted[]; rejectedDocuments: DocumentRejected[] }>(
        url,
        { documents: invoices },
        {
          headers: header,
          httpsAgent: new https.Agent({
            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
          }),
        },
      )
      .pipe(
        map(response => response.data.acceptedDocuments),
        catchError(error => {
          //TODO: HANDLE ERROR OF SAME INVOICE
          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(',') ?? error.response.data.error, error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  async rejectOrCancelInvoice(
    uuid: string,
    status: 'cancelled' | 'rejected',
    reason: string,
    credential: EtaCredentials,
    organizationId: string,
  ): Promise<boolean> {
    const header = await this.eta.login(credential, organizationId);
    const url = `${this.configs.apiVersionUrl}/documents/state/${uuid}/state`;

    const response = this.http
      .put<boolean>(
        url,
        { status, reason },
        {
          headers: header,
          httpsAgent: new https.Agent({
            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
          }),
        },
      )
      .pipe(
        map(response => response.data as boolean),
        catchError(error => {
          // this.logger.error(error);
          // throw new InternalServerErrorException('Something went wrong while canceling document!');

          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  async queryDocuments(query: QueryInvoices, credential: EtaCredentials, organizationId: string): Promise<InvoiceQueryResult> {
    const header = await this.eta.login(credential, organizationId);

    const remainingQuery = Utils.Tax.buildEtaQuery(query);
    const urlQuery = remainingQuery ? `${remainingQuery}` : '';
    const url = `${this.configs.apiVersionUrl}/documents/search?${urlQuery}`;

    const response = this.http
      .get<InvoiceQueryResult>(url, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      })
      .pipe(
        map(response => response.data),
        catchError(error => {
          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  async getInvoicePdf(uuid: string, credential: EtaCredentials, organizationId: string): Promise<any> {
    const header = await this.eta.login(credential, organizationId);

    const url = `${this.configs.apiVersionUrl}/documents/${uuid}/pdf`;

    const response = this.http
      .get<any>(url, {
        headers: header,
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
        responseType: 'arraybuffer',
      })
      .pipe(
        map(response => response.data),
        catchError(error => {
          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(','), error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }
}
