import { CurrencyCode } from '../../../enums';

export interface PayTabsInvoice {
  id: string;
}

export interface PaytabsInvoiceParams {
  profile_id?: string;
  tran_type?: TransactionType;
  tran_class?: TransactionClass;
  cart_currency?: CurrencyCode;
  cart_amount?: number;
  cart_id?: string;
  cart_description?: string;
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
    zip?: number;
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
    line_items?: [
      {
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
      },
    ];
  };
  callback?: string;
  return?: string;
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
