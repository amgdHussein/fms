import { CurrencyCode } from '../../../enums';
import { TransactionClass, TransactionType } from './paytabs-invoice-request.entity';

export interface PayTabsTransactionRefundBody {
  profile_id: number;
  tran_type: TransactionType.REFUND;
  cart_amount: number;
  tran_ref: string;
  tran_class: TransactionClass;
  cart_id: string;
  cart_currency: CurrencyCode;
  cart_description: string;
}
