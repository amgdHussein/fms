import { CartCurrency, TransactionClass, TransactionType } from './paytabs-invoice-request.entity';

export interface PayTabsPaymentResponse {
  tran_ref?: string;
  merchant_id?: number;
  profile_id?: number;
  cart_id?: string;
  cart_description?: string;
  cart_currency?: CartCurrency;
  cart_amount?: string;
  tran_currency?: CartCurrency;
  tran_total?: string;
  tran_type?: TransactionType;
  tran_class?: TransactionClass;
  customer_details?: {
    name?: string;
    email?: string;
    phone?: string;
    street1?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    ip?: string;
  };
  shipping_details?: {
    name?: string;
    email?: string;
    phone?: string;
    street1?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  payment_result?: {
    response_status?: PaymentResponseStatus;
    response_code?: string;
    response_message?: string;
    acquirer_message?: string;
    cvv_result?: string;
    avs_result?: string;
    transaction_time?: string;
  };
  payment_info?: {
    payment_method?: string;
    card_type?: string;
    card_scheme?: string;
    payment_description?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  ipn_trace?: string;
}

// For more information about the PayTabs Payment Response, visit: https://support.paytabs.com/en/support/solutions/articles/60000711358-what-is-response-code-vs-the-response-status-

export enum PaymentResponseStatus {
  A = 'A', //Authorized
  H = 'H', //Hold (Authorized but on hold for further anti-fraud review)
  P = 'P', //Pending (for refunds)
  V = 'V', //Voided
  E = 'E', //Error
  D = 'D', //Declined
  X = 'X', //Expired
}
