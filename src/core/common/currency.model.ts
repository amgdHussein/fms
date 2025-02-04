import { CurrencyCode } from './currency.enum';

export interface Currency {
  code: CurrencyCode;
  rate: number;
}
