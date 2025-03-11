import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { catchError, firstValueFrom, map } from 'rxjs';

import { CurrencyCode } from '../../enums';

import { PayTabsInvoice, PaytabsInvoiceParams, PayTabsTransactionRefundBody, TransactionClass, TransactionType } from './entities';
import { PayTabsConfigs } from './paytabs.config';

@Injectable()
export class PayTabsService {
  private readonly BASE_URL = 'https://secure-egypt.paytabs.com';

  // THINK OF ?  MAP BASE URL TO ORGANIZATION COUNTRY or client country
  // KSA = 'https://secure.paytabs.sa';
  // UAE = 'https://secure.paytabs.com';
  // EGYPT = 'https://secure-egypt.paytabs.com';
  // OMAN = 'https://secure-oman.paytabs.com';
  // KUWAIT = 'https://secure-kuwait.paytabs.com';
  // JORDAN = 'https://secure-jordan.paytabs.com';
  // GLOBAL = 'https://secure-global.paytabs.com';

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
          // tran_ref: 'TST2506602028033',
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

  refundTransaction(): any {
    const endpoint = `${this.BASE_URL}/payment/request`;

    // refund response {
    //   tran_ref: 'TST2506902031415',
    //   previous_tran_ref: 'TST2506702028140',
    //   tran_type: 'Refund',
    //   cart_id: 'pAgEwXQvAHL8I2MiTxZk',
    //   cart_description: 'Refund reason',
    //   cart_currency: 'EGP',
    //   cart_amount: '1000.00',
    //   tran_currency: 'EGP',
    //   tran_total: '1000.00',
    //   customer_details: {
    //     name: 'One Eg INC',
    //     email: 'mahmod.mohy@yahoo.com',
    //     street1: 'cairo',
    //     city: 'cairo',
    //     state: 'C',
    //     country: 'EG'
    //   },
    //   payment_result: {
    //     response_status: 'A',
    //     response_code: 'G44735',
    //     response_message: 'Authorised',
    //     transaction_time: '2025-03-10T22:12:15Z'
    //   },
    //   payment_info: {
    //     payment_method: 'Visa',
    //     card_type: 'Credit',
    //     card_scheme: 'Visa',
    //     payment_description: '4000 00## #### 0002',
    //     expiryMonth: 5,
    //     expiryYear: 2027
    //   },
    //   serviceId: 1,
    //   paymentChannel: 'Transaction API',
    //   profileId: 140150,
    //   merchantId: 79780,
    //   trace: 'PMNT0402.67CF63BF.00062F83'
    // }

    // ON REFUND WITH THE SAME AMOUNT
    // payment_result: {
    //   response_status: 'E',
    //   response_code: '118',
    //   response_message: 'Amount greater than available balance',
    //   cvv_result: ' ',
    //   avs_result: ' ',
    //   transaction_time: '2025-03-10T23:35:52Z'
    // },

    const refundBody: PayTabsTransactionRefundBody = {
      profile_id: +this.configs.profileId, //TODO: MAKE PROFILE ID NUMBER
      tran_type: TransactionType.REFUND,
      tran_class: TransactionClass.ECOM,
      cart_id: '5F0srVVkhuMpr927Fe9k',
      cart_description: 'Refund reason',
      cart_currency: CurrencyCode.EGP,
      cart_amount: 50,
      tran_ref: 'TST2506702028092',
    };

    const request = this.http
      .post<any>(endpoint, refundBody, {
        headers: { Authorization: `${this.configs.serverKey}` },
      })
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
