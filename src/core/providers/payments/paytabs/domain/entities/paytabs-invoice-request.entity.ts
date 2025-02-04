export interface PaytabsInvoiceRequest {
  profile_id?: string;
  tran_type?: TransactionType;
  tran_class?: TransactionClass;
  cart_currency?: string; //TODO change to enum
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
  sale = 'sale',
  auth = 'auth',
  refund = 'refund',
  register = 'register',
  void = 'void',
  release = 'release',
  capture = 'capture',
}

export enum TransactionClass {
  ecom = 'ecom',
  recurring = 'recurring',
  moto = 'moto',
}

export enum CartCurrency {
  SAR = 'SAR',
  AED = 'AED',
  BHD = 'BHD',
  EGP = 'EGP',
  EUR = 'EUR',
  GBP = 'GBP',
  HKD = 'HKD',
  IDR = 'IDR',
  INR = 'INR',
  IQD = 'IQD',
  JOD = 'JOD',
  JPY = 'JPY',
  KWD = 'KWD',
  MAD = 'MAD',
  OMR = 'OMR',
  PKR = 'PKR',
  QAR = 'QAR',
  USD = 'USD',
}

export enum PaymentMethod {
  all = 'all',
  creditcard = 'creditcard',
  amex = 'amex',
  mada = 'mada',
  urpay = 'urpay',
  unionpay = 'unionpay',
  stcpay = 'stcpay',
  stcpayqr = 'stcpayqr',
  valu = 'valu',
  aman = 'aman',
  meezaqr = 'meezaqr',
  omannet = 'omannet',
  knet = 'knet',
  knetdebit = 'knetdebit',
  knetcredit = 'knetcredit',
  applepay = 'applepay',
  samsungpay = 'samsungpay',
  installment = 'installment',
  forsa = 'forsa',
  halan = 'halan',
  tamara = 'tamara',
  amaninstallments = 'amaninstallments',
  souhoola = 'souhoola',
  tabby = 'tabby',
  touchpoints = 'touchpoints',
  paypal = 'paypal',
  sadad = 'sadad',
}
