import { CurrencyCode } from '../../../enums';

export interface PayTabsInvoice {
  id: string;
}

export interface PaytabsInvoiceParams {
  profile_id: number;
  tran_type: TransactionType;
  tran_class: TransactionClass;
  cart_currency: CurrencyCode;
  cart_amount: number;
  cart_id: string;
  cart_description: string;
  hide_shipping?: boolean;
  customer_ref?: string;
  payment_methods?: PaymentMethod[];
  customer_details?: {
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
    street1?: string;
    zip?: string;
  };
  invoice?: {
    lang?: 'en' | 'ar';
    shipping_charges?: number;
    extra_charges?: number;
    extra_discount?: number;
    total?: number;
    activation_date?: string;
    expiry_date?: string;
    due_date?: string;
    disable_edit?: boolean;
    line_items?: {
      sku?: string;
      description?: string;
      url?: string;
      unit_cost?: number;
      quantity?: number;
      net_total?: number;
      discount_rate?: number;
      discount_amount?: number;
      tax_rate?: number;
      tax_total?: number;
      total?: number;
    }[];
  };

  agreement?: {
    agreement_description?: string; // This parameter indicates the agreement description which you can use to distinguish your agreements and you can also use it as a title for your agreement.
    agreement_currency?: CurrencyCode; // This parameter indicates the currency that this agreement will be initiated in and you need to make sure that this is the same currency that you have passed inside the cart_currency parameter and that this currency is configured in your PayTabs profile.
    initial_amount?: number; // This parameter indicates the initial amount that you will be requesting your customer to pay in this agreement, and you need to make sure that it is the same amount as the one you passed inside the cart_amount parameter.
    repeat_amount?: number; // This parameter indicates the repeated amount the you want to charge your customer with at the specified time intervals that you will be passing in the below parameters.
    final_amount?: number; // This parameter indicates if you want to charge your customer with a final amount after completing the whole agreement payments. Note that this will not be applicable to unlimited term agreements (when setting the "repeat_terms" to 0).
    repeat_terms?: number; // This parameter indicates the number of times you want to repeat the payment or charge your customers and here you will be repeating the charge of the amount specified in the "repeat_amount" parameter. Note that if you passed 0 to this parameter, it means that you will be initiating an open agreement that will keep charging the customer forever or until you cancel the agreement through your dashboard.
    repeat_period?: number; // 1 = day, 2 = week, 3 = month
    repeat_every?: number /* e.g. 4 .   every 1 week, or every 4 days etc */;
    first_installment_due_date?: string; // i.e. "05/May/2024"  /* Cannot be on or before today */;
  };

  user_defined: {
    udf1: string;
    udf2: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
    udf6?: string;
    udf7?: string;
    udf8?: string;
    udf9?: string;
  };
  callback?: string;
  return?: string;
}

export interface PaytabsHostedPaymentPageParams {
  profile_id: number;
  tran_type: TransactionType;
  tran_class: TransactionClass;
  cart_id: string;
  cart_description: string;
  cart_currency: CurrencyCode;
  cart_amount: number;
  show_save_card: boolean;
  agreement: {
    agreement_description: string; // This parameter indicates the agreement description which you can use to distinguish your agreements and you can also use it as a title for your agreement.
    agreement_currency: CurrencyCode; // This parameter indicates the currency that this agreement will be initiated in and you need to make sure that this is the same currency that you have passed inside the cart_currency parameter and that this currency is configured in your PayTabs profile.
    initial_amount: number; // This parameter indicates the initial amount that you will be requesting your customer to pay in this agreement, and you need to make sure that it is the same amount as the one you passed inside the cart_amount parameter.
    repeat_amount: number; // This parameter indicates the repeated amount the you want to charge your customer with at the specified time intervals that you will be passing in the below parameters.
    final_amount: 0; // This parameter indicates if you want to charge your customer with a final amount after completing the whole agreement payments. Note that this will not be applicable to unlimited term agreements (when setting the "repeat_terms" to 0).
    repeat_terms: 0; // from 0 to 48,  This parameter indicates the number of times you want to repeat the payment or charge your customers and here you will be repeating the charge of the amount specified in the "repeat_amount" parameter. Note that if you passed 0 to this parameter, it means that you will be initiating an open agreement that will keep charging the customer forever or until you cancel the agreement through your dashboard.
    repeat_period: 2 | 3; // 1 = day, 2 = week, 3 = month
    repeat_every: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 /* e.g. 4 .   every 1 week, or every 4 days etc */;
    first_installment_due_date: string; // i.e. "05/May/2024"  /* Cannot be on or before today */;
  };

  // Optional in paytabs
  customer_details: {
    name: string; // Optional in paytabs
    email: string; // Optional in paytabs
    phone?: string; // Optional in paytabs
    street1: string; // Optional in paytabs
    city: string; // Optional in paytabs
    state?: string;
    country: string; // Optional in paytabs
    zip?: string;
  };

  shipping_details?: {
    name?: string; // Optional in paytabs
    email?: string; // Optional in paytabs
    phone?: string; // Optional in paytabs
    street1?: string; // Optional in paytabs
    city?: string; // Optional in paytabs
    state?: string;
    country?: string; // Optional in paytabs
    zip?: string;
  };

  framed?: boolean; // Optional in paytabs
  framed_return_top?: boolean; // Optional in paytabs
  framed_return_parent?: boolean; // Optional in paytabs
  framed_message_target?: string; // Optional in paytabs

  paypage_lang?: 'en' | 'ar'; // Optional in paytabs
  config_id?: number; // Optional in paytabs
  hide_shipping?: boolean;

  payment_methods?: PaymentMethod[];

  user_defined: {
    udf1: string;
    udf2: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
    udf6?: string;
    udf7?: string;
    udf8?: string;
    udf9?: string;
  };

  callback: string; // Optional in paytabs
  return: string; // Optional in paytabs
}

export enum TransactionType {
  SALE = 'sale',
  AUTH = 'auth',
  REFUND = 'refund',
  REGISTER = 'register',
  VOID = 'void',
  RELEASE = 'release',
  CAPTURE = 'capture',
}

export enum TransactionClass {
  ECOM = 'ecom',
  RECURRING = 'recurring',
  MOTO = 'moto',
}

export enum PaymentMethod {
  ALL = 'all',
  CREDIT_CARD = 'creditcard',
  AMEX = 'amex',
  MADA = 'mada',
  URPAY = 'urpay',
  UNION_PAY = 'unionpay',
  STC_PAY = 'stcpay',
  STC_PAY_QR = 'stcpayqr',
  VALU = 'valu',
  AMAN = 'aman',
  MEEZAQR = 'meezaqr',
  OMANNET = 'omannet',
  KNET = 'knet',
  KNET_DEBIT = 'knetdebit',
  KNET_CREDIT = 'knetcredit',
  APPLE_PAY = 'applepay',
  SAMSUNG_PAY = 'samsungpay',
  INSTALLMENT = 'installment',
  FORSA = 'forsa',
  HALAN = 'halan',
  TAMARA = 'tamara',
  AMAN_INSTALLMENTS = 'amaninstallments',
  SOUHOOLA = 'souhoola',
  TABBY = 'tabby',
  TOUCH_POINTS = 'touchpoints',
  PAYPAL = 'paypal',
  SADAD = 'sadad',
}
