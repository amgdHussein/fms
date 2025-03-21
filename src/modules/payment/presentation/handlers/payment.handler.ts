import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import Stripe from 'stripe';

import { PaymentCronManager } from '../../infrastructure';

// TODO: FINALIZE THIS CONTROLLER
// TODO: HIDE THE CONTROLLER FORM THE API DOCUMENTATION
@ApiTags('Webhooks')
@Controller('webhooks')
export class PaymentHandler {
  constructor(private paymentManager: PaymentCronManager) {}

  @Post('payments/stripe')
  async stripeWebhook(@Body() body: Stripe.EventBase): Promise<void> {
    // console.log('stripe body', body);
    await this.paymentManager.handleStripeWebhook(body);
  }

  @Post('payments/paytabs')
  async payTabsWebhook(@Body() body: any): Promise<void> {
    console.log('paytabs webhook body', body);

    // HOSTED PAYMENT WITH AGREEMENTS
    // paytabs webhook body {
    //   tran_ref: 'TST2507802036079',
    //   merchant_id: 79780,
    //   profile_id: 140150,
    //   cart_id: 'hOabKAKvlYutzcdeWa1F',
    //   cart_description: 'Subscription for Mofawtar',
    //   cart_currency: 'EGP',
    //   cart_amount: '700.00',
    //   tran_currency: 'EGP',
    //   tran_total: '700.00',
    //   tran_type: 'Sale',
    //   tran_class: 'ECom',
    //   agreement_id: 1366,
    //   customer_details: {
    //     name: 'Test Mohy',
    //     email: 'mahmod.mohy@yahoo.com',
    //     street1: 'cairo',
    //     city: 'cairo',
    //     state: 'PTS',
    //     country: 'EG',
    //     ip: '197.54.117.27'
    //   },
    //   payment_result: {
    //     response_status: 'A',
    //     response_code: 'G87214',
    //     response_message: 'Authorised',
    //     acquirer_ref: 'TRAN0002.67DAB80E.000053B0',
    //     cvv_result: ' ',
    //     avs_result: ' ',
    //     transaction_time: '2025-03-19T12:26:54Z'
    //   },
    //   payment_info: {
    //     payment_method: 'Visa',
    //     card_type: 'Credit',
    //     card_scheme: 'Visa',
    //     payment_description: '4000 00## #### 0002',
    //     expiryMonth: 2,
    //     expiryYear: 2026
    //   },
    //   user_defined: {
    //     udf2: '["type:2","subscriptionId:hOabKAKvlYutzcdeWa1F","planId:SOmoX0n7hryZrq5h2M30"]'
    //   },
    //   threeDSDetails: {
    //     responseLevel: 2,
    //     responseStatus: 4,
    //     enrolled: 'Y',
    //     paResStatus: 'Y',
    //     eci: '05',
    //     cavv: '',
    //     ucaf: 'VFNUMjUwNzgwMjAzNjA3OTExNzA=',
    //     threeDSVersion: 'Test/Simulation'
    //   },
    //   ipn_trace: 'IPNS0002.67DAB80E.0000089B',
    //   paymentChannel: 'Payment Page'
    // }

    // hosted page payment
    // paytabs webhook body {
    //   tran_ref: 'TST2507102033213',
    //   merchant_id: 79780,
    //   profile_id: 140150,
    //   cart_id: 'hOabKAKvlYutzcdeWa1F',
    //   cart_description: 'Subscription for Mofawtar',
    //   cart_currency: 'EGP',
    //   cart_amount: '300.00',
    //   tran_currency: 'EGP',
    //   tran_total: '300.00',
    //   tran_type: 'Sale',
    //   tran_class: 'ECom',
    //   customer_details: {
    //     name: 'One Eg INC',
    //     email: 'mahmod.mohy@yahoo.com',
    //     street1: 'cairo',
    //     city: 'cairo',
    //     state: 'PTS',
    //     country: 'EG',
    //     ip: '197.54.60.13'
    //   },
    //   payment_result: {
    //     response_status: 'A',
    //     response_code: 'G10339',
    //     response_message: 'Authorised',
    //     acquirer_ref: 'TRAN0002.67D1EAA2.0000F649',
    //     cvv_result: ' ',
    //     avs_result: ' ',
    //     transaction_time: '2025-03-12T20:12:19Z'
    //   },
    //   payment_info: {
    //     payment_method: 'Visa',
    //     card_type: 'Credit',
    //     card_scheme: 'Visa',
    //     payment_description: '4111 11## #### 1111',
    //     expiryMonth: 2,
    //     expiryYear: 2026
    //   },
    //   user_defined: { udf1: '["type:2","subscriptionId:hOabKAKvlYutzcdeWa1F"]' },
    //   threeDSDetails: {
    //     responseLevel: 1,
    //     responseStatus: 1,
    //     enrolled: 'N',
    //     paResStatus: '',
    //     eci: '',
    //     cavv: '',
    //     ucaf: '',
    //     threeDSVersion: 'Test/Simulation'
    //   },
    //   ipn_trace: 'IPNS0002.67D1EAA3.00001A32',
    //   paymentChannel: 'Payment Page'
    // }

    // invoice payment
    // {
    //   "tran_ref": "TST2506502027873",
    //   "merchant_id": 79780,
    //   "profile_id": 140150,
    //   "cart_id": "0ia4Gb3qxFw4tNhMmgyG",
    //   "cart_description": "Created By Mofawtar invoice for client One Eg INC",
    //   "cart_currency": "EGP",
    //   "cart_amount": "2000.00",
    //   "tran_currency": "EGP",
    //   "tran_total": "2000.00",
    //   "tran_type": "Sale",
    //   "tran_class": "ECom",
    //   "invoice_id": 3167463,
    //   "customer_details": {
    //     "name": "One Eg INC",
    //     "email": "mahmod.mohy@yahoo.com",
    //     "street1": "cairo",
    //     "city": "cairo",
    //     "state": "PTS",
    //     "country": "EG",
    //     "ip": "197.54.59.130"
    //   },
    //   "payment_result": {
    //     "response_status": "A",
    //     "response_code": "G64282",
    //     "response_message": "Authorised",
    //     "acquirer_ref": "TRAN0002.67C99599.0000322B",
    //     "cvv_result": " ",
    //     "avs_result": " ",
    //     "transaction_time": "2025-03-06T12:31:22Z"
    //   },
    //   "payment_info": {
    //     "payment_method": "Visa",
    //     "card_type": "Credit",
    //     "card_scheme": "Visa",
    //     "payment_description": "4000 00## #### 0002",
    //     "expiryMonth": 2,
    //     "expiryYear": 2026
    //   },
    //   "threeDSDetails": {
    //     "responseLevel": 2,
    //     "responseStatus": 4,
    //     "enrolled": "Y",
    //     "paResStatus": "Y",
    //     "eci": "05",
    //     "cavv": "",
    //     "ucaf": "VFNUMjUwNjUwMjAyNzg3MzBkNDA=",
    //     "threeDSVersion": "Test/Simulation"
    //   },
    //   "ipn_trace": "IPNS0002.67C9959A.00000627",
    //   "paymentChannel": "Invoice"
    // }
    await this.paymentManager.handlePaytabsWebhook(body);
  }
}
