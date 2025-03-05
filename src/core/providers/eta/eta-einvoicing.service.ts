import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';

import * as crypto from 'crypto';
import * as https from 'https';

import { ETA_CONFIGS_PROVIDER, ETA_PROVIDER, HTTP_PROVIDER } from '../../constants';
import { Utils } from '../../utils';

import { BadRequestException } from '../../exceptions';
import { AddEtaInvoice, EtaCredentials, EtaInvoice, GetInvoices, QueryDocumentsResponse } from './entities';
import { EtaConfigs } from './eta.config';
import { EtaService } from './eta.service';

interface DocumentAccepted {
  uuid: string;
  longId: string;
  internalId: string;
  hashKey: string;
}

// TODO: check type in real test
interface DocumentRejected {
  internalId: string;
  error: { code?: string; message?: string; target?: string; propertyPath?: any; details?: any[] };
}

interface InvoiceResponse {
  submissionId: string;
  acceptedDocuments: DocumentAccepted[];
  rejectedDocuments: DocumentRejected[];
}

export type DocumentStatus = 'cancelled' | 'rejected';

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

  // getDocumentDetails
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

  // Submit Documents
  async addInvoices(invoices: AddEtaInvoice[], credential: EtaCredentials, organizationId: string): Promise<InvoiceResponse> {
    // Before further processing, validate the invoice type
    for (const invoice of invoices) await this.validateInvoiceType(invoice);

    const header = await this.eta.login(credential, organizationId);
    const url = `${this.configs.apiVersionUrl}/documentsubmissions`;

    const response = this.http
      .post<InvoiceResponse>(
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
        map(response => response.data),
        catchError(error => {
          //TODO: HANDLE ERROR OF SAME INVOICE
          throw new HttpException(error.response.data.error?.details?.map(err => err.message).join(',') ?? error.response.data.error, error.response.status, {
            cause: new Error(error.response.data.error?.details?.map(err => err.target).join(',')),
          });
        }),
      );

    return firstValueFrom(response);
  }

  // Cancel Document and Reject Document
  async rejectOrCancelInvoice(uuid: string, status: DocumentStatus, reason: string, credential: EtaCredentials, organizationId: string): Promise<boolean> {
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

  // Search Documents
  async queryDocuments(query: GetInvoices, credential: EtaCredentials, organizationId: string): Promise<QueryDocumentsResponse> {
    const header = await this.eta.login(credential, organizationId);

    const remainingQuery = Utils.Eta.buildEtaQuery(query);
    const urlQuery = remainingQuery ? `${remainingQuery}` : '';
    const url = `${this.configs.apiVersionUrl}/documents/search?${urlQuery}`;

    const response = this.http
      .get<QueryDocumentsResponse>(url, {
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

  // Get Document Printout
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

  private async validateInvoiceType(invoice: AddEtaInvoice): Promise<boolean> {
    // All lines must have weight quantity
    const haveWeight = (): boolean => {
      if (invoice.invoiceLines.every(line => !!line.weightQuantity)) return true;
      throw new BadRequestException('All lines must have weight quantity!');
    };

    // At least one reference must be present
    const hasReference = (): boolean => {
      if (invoice.references.length > 0) return true;
      throw new BadRequestException('At least one reference must be present!');
    };

    // Invoice must have a service delivery date
    const hasServiceDeliveryDate = (): boolean => {
      if (invoice.serviceDeliveryDate) return true;
      throw new BadRequestException('Invoice must have a service delivery date!');
    };

    return new Promise<boolean>((resolve, reject) => {
      try {
        const validate = (): boolean => {
          switch (invoice.documentType) {
            case 'C':
              return hasReference();

            case 'D':
              return hasReference();

            case 'EC':
              return haveWeight() && hasServiceDeliveryDate() && hasReference();

            case 'ED':
              return haveWeight() && hasServiceDeliveryDate() && hasReference();

            case 'EI':
              return haveWeight() && hasServiceDeliveryDate();

            default:
              return true;
          }
        };

        resolve(validate());
      } catch (error) {
        reject(error);
      }
    });
  }
}
