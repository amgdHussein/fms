import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { catchError, firstValueFrom, map } from 'rxjs';

import { CurrencyCode } from '../../enums';

import { PayTabsInvoice, PaytabsInvoiceParams, TransactionClass, TransactionType } from './entities';
import { PayTabsConfigs } from './paytabs.config';

@Injectable()
export class PayTabsService {
  private readonly BASE_URL = 'https://secure-egypt.paytabs.com';

  // @Inject(HTTP_PROVIDER)
  // private readonly http: HttpService;

  constructor(
    private readonly configs: PayTabsConfigs,
    private readonly http: HttpService,
  ) {}

  // async createHostedPaymentPage(data: PaytabsInvoiceParams): Promise<PayTabsInvoice> {
  //   const endpoint = `${this.BASE_URL}/payment/request`;

  //   try {
  //     const request = this.http.post(endpoint, data, {
  //       headers: {
  //         Authorization: `${this.configs.serverKey}`,
  //       },
  //     });

  //     const response = await firstValueFrom(request);
  //     return response.data;
  //   } catch (error) {
  //     this.handlePayTabsError(error);
  //   }
  // }

  // ? Invoices

  async addInvoice(invoice: { id: string; currency: CurrencyCode; amount: number; clientName: string; metadata: string }): Promise<PayTabsInvoice> {
    const endpoint = `${this.BASE_URL}/payment/invoice/new`;

    const payTabsInvoice: PaytabsInvoiceParams = {
      profile_id: this.configs.profileId,
      tran_type: TransactionType.SALE,
      tran_class: TransactionClass.ECOM,
      cart_currency: invoice.currency,
      cart_amount: invoice.amount,
      cart_id: invoice.id, //TODO: THINK OF ADD ENTITIES NUMBER INSTEAD OF ID
      cart_description: 'Created By Mofawtar invoice for client ' + invoice.clientName,
      user_defined: {
        udf1: `${JSON.stringify(invoice.metadata)}`,
      },

      hide_shipping: true,
      customer_details: {
        name: invoice.clientName,
        // country: 'EGY',
      },
      invoice: {
        lang: 'en',
        total: invoice.amount,
        expiry_date: moment().add(30, 'days').toISOString(),
        // due_date: new Date(+new Date()).toISOString(), // now
        disable_edit: true,
        line_items: [
          {
            sku: invoice.id,
            description: `Invoice for ${invoice.clientName} Created By Mofawtar`,
            unit_cost: invoice.amount,
            quantity: 1,
            net_total: invoice.amount,
            total: invoice.amount,
          },
        ],
      },

      callback: `${process.env.PROD_URL}/payments/handler/paytabs`,
      // return: 'https://www.dashboard.mofawtar.com/', //TODO: THIS OF URL IN FRONTEND
    };

    const request = this.http
      .post<PayTabsInvoice>(endpoint, payTabsInvoice, {
        headers: { Authorization: `${this.configs.serverKey}` },
      })
      .pipe(
        map(response => response.data),
        catchError(this.handlePayTabsError),
      );

    return firstValueFrom(request);
  }

  async queryTransactionByTranRef(): Promise<any> {
    const endpoint = `${this.BASE_URL}/payment/query`; // THIS IS THE SAME AS WEBHOOK RETURNS
    // const endpoint = `${this.BASE_URL}/payment/invoice/${3167496}/view`;
    // const endpoint = `${this.BASE_URL}/payment/invoice/search`;

    const request = this.http
      .post<any>(
        endpoint,
        {
          profile_id: 140150,
          tran_ref: 'TST2506702028140',
          // cart_id: 'FUbMYmXGXHBtmZtVTI2N',
        },
        {
          headers: { Authorization: `${this.configs.serverKey}` },
        },
      )
      .pipe(
        map(response => response.data),
        catchError(this.handlePayTabsError),
      );

    return firstValueFrom(request);
  }

  private readonly handlePayTabsError = (error: any) => {
    throw new Error(`PayTabs Error: ${error.response?.data?.message || error.message}`);
  };
}
