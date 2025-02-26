import { CurrencyCode } from '../enums';

export interface Currency {
  code: CurrencyCode;
  rate: number;
}
