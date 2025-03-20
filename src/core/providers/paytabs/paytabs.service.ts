import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, map } from 'rxjs';

import { CurrencyCode, Cycle } from '../../enums';

import { DateTime } from 'luxon';
import { Organization } from '../../../modules/organization/domain';
import { Plan } from '../../../modules/subscription/domain';
import {
  CancelAgreementResponse,
  HostedPageResponse,
  PaytabsHostedPaymentPageParams,
  PayTabsInvoice,
  PaytabsInvoiceParams,
  PayTabsTransactionRefundBody,
  TransactionClass,
  TransactionType,
} from './entities';
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

  async createHostedPaymentPage(
    subscriptionId: string,
    customer: Organization,
    plan: Plan,
    totalAmount: number,
    metadata: string,
  ): Promise<HostedPageResponse> {
    const endpoint = `${this.BASE_URL}/payment/request`;

    const hostPaymentBody: PaytabsHostedPaymentPageParams = {
      profile_id: this.configs.profileId,
      tran_type: TransactionType.SALE,
      tran_class: TransactionClass.ECOM,
      cart_id: subscriptionId,
      cart_currency: CurrencyCode.EGP,
      cart_amount: totalAmount,
      cart_description: 'Subscription for Mofawtar',
      hide_shipping: true,
      show_save_card: false, //TODO: TEST THIS
      callback: `${process.env.PROD_URL}/webhooks/payments/paytabs`, //TODO: THINK OF ADD DIFFERENT CALLBACK FOR SUBSCRIPTION
      return: process.env.PAYTABS_RETURN_URL, //'http://localhost:4200/success', //TODO: THIS OF URL IN FRONTEND
      user_defined: {
        udf1: '',
        udf2: `${JSON.stringify(metadata)}`,
      },
      agreement: {
        agreement_description: 'Subscription for Mofawtar website',
        agreement_currency: CurrencyCode.EGP,
        initial_amount: totalAmount,
        repeat_amount: totalAmount,
        final_amount: 0,
        repeat_terms: 0, // 0 means unlimited
        repeat_period: 2, // means monthly only because paytabs does not support yearly
        repeat_every: plan.cycle === Cycle.MONTHLY ? 1 : 12, // 1 means every month, 12 means every year
        first_installment_due_date:
          plan.cycle === Cycle.MONTHLY ? DateTime.now().plus({ month: 1 }).toFormat('dd-MM-yyyy') : DateTime.now().plus({ year: 1 }).toFormat('dd-MM-yyyy'), // '20/03/2025'  TODO: MAKE DYNAMIC
      },

      customer_details: {
        name: customer.name,
        email: customer.email,
        street1: customer.address.street,
        city: customer.address.city,
        state: customer.address.governorate,
        country: customer.address.country,
      },
    };

    const request = this.http
      .post<HostedPageResponse>(endpoint, hostPaymentBody, {
        headers: { Authorization: `${this.configs.serverKey}` },
      })
      .pipe(
        map(response => response.data),
        catchError(this.handlePayTabsError),
      );

    // hostedPage {
    //   tran_ref: 'TST2507102033213',
    //   tran_type: 'Sale',
    //   cart_id: 'hOabKAKvlYutzcdeWa1F',
    //   cart_description: 'Subscription for Mofawtar',
    //   cart_currency: 'EGP',
    //   cart_amount: '300.00',
    //   tran_total: '0',
    //   callback: 'https://frank-chicken-quietly.ngrok-free.app/webhooks/payments/paytabs',
    //   return: 'http://localhost:4200/success',
    //   redirect_url: 'https://secure-egypt.paytabs.com/payment/wr/5D222F5582E41ABE3E74C715A4EEE69933AEF4F151486544741ABC2A',
    //   serviceId: 2,
    //   paymentChannel: 'Payment Page',
    //   profileId: 140150,
    //   merchantId: 79780,
    //   trace: 'PMNT0401.67D1EA4C.00008A2A'
    // }

    return firstValueFrom(request);
  }

  // private getRepaeatPeriod(cycle: Cycle): number {
  //   let repeatPeriod = 1;
  //   switch (cycle) {
  //     case Cycle.WEEKLY:
  //       repeatPeriod = 2;
  //       break;
  //     case Cycle.MONTHLY:
  //       repeatPeriod = 3;
  //       break;
  //     case Cycle.QUARTERLY:
  //       repeatPeriod = 4;
  //       break;
  //     case Cycle.YEARLY:
  //       repeatPeriod = 5;
  //       break;
  //     default:
  //       repeatPeriod = 1;
  //       break;
  // }

  async cancelAgreement(agreementId: number): Promise<CancelAgreementResponse> {
    const endpoint = `${this.BASE_URL}/payment/agreement/cancel`;

    const hostPaymentBody = {
      profile_id: this.configs.profileId,
      agreement_id: agreementId,
    };

    const request = this.http
      .post<CancelAgreementResponse>(endpoint, hostPaymentBody, {
        headers: { Authorization: `${this.configs.serverKey}` },
      })
      .pipe(
        map(response => response.data),
        catchError(this.handlePayTabsError),
      );

    // {
    //   message: 'Agreement has been cancelled',
    //   status: 'success',
    //   trace: 'PMNT0402.67DAAE3D.00001ECC'
    // }

    return firstValueFrom(request);
  }

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
        udf2: '',
      },

      customer_details: {
        name: invoice.clientName,
        // country: 'EGY',
      },
      invoice: {
        lang: 'en',
        total: invoice.amount,
        // expiry_date: moment().add(30, 'days').toISOString(),
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

      callback: `${process.env.PROD_URL}/webhooks/payments/paytabs`,
      return: 'http://localhost:4200/success', //TODO: THIS OF URL IN FRONTEND
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
