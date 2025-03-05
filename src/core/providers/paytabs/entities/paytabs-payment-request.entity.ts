import { CurrencyCode } from '../../../enums';
import { TransactionClass, TransactionType } from './paytabs-invoice-request.entity';

export interface PayTabsPaymentRequest {
  profile_id: string;
  tran_type: TransactionType;
  tran_class: TransactionClass;
  payment_methods: string[];
  cart_id: string;
  cart_amount: number;
  cart_currency: CurrencyCode;
  cart_description: string;
  paypage_lang: 'en' | 'ar';
  customer_details: {
    name: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    street1: string;
    zip: string;
  };
  hide_shipping: boolean;
  callback: string;
  return: string;
}
