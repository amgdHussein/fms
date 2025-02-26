import { Address } from './address.model';
import { Phone } from './phone.model';

export interface Issuer {
  name: string;
  address: Address;
  taxId?: string;
  commercialRegistryNo?: string;
  email?: string;
  phone?: Phone;
}
