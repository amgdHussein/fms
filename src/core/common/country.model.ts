import { CountryCode } from './country-code.enum';
import { CountryTimezone } from './country-timezone.enum';

export interface Country {
  id: number;
  code: CountryCode;
  name: string;
  nameAr: string;
  flag: string;
  phoneCode: string;
  phoneMinLength: number;
  phoneMaxLength: number;

  // Idx of timeZone = Idx of Offset
  timeZones: CountryTimezone[];
  offset: string[];
}
