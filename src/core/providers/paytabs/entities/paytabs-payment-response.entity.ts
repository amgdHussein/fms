import { CurrencyCode } from '../../../enums';
import { TransactionClass, TransactionType } from './paytabs-invoice-request.entity';

export interface PayTabsPaymentResponse {
  tran_ref?: string;
  merchant_id?: number;
  profile_id: number;
  cart_id?: string;
  cart_description?: string;
  cart_currency?: CurrencyCode;
  cart_amount?: string;
  tran_currency?: CurrencyCode;
  tran_total?: string;
  tran_type?: TransactionType;
  tran_class?: TransactionClass;
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
  AUTHORIZED = 'A', // Authorized
  HOLD = 'H', // Hold (Authorized but on hold for further anti-fraud review)
  PENDING = 'P', // Pending (for refunds)
  VOIDED = 'V', // Voided
  ERROR = 'E', // Error
  DECLINED = 'D', // Declined
  EXPIRED = 'X', // Expired
}
