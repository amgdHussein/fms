import { IssuerType } from '../providers';
import { Address } from './address.model';
import { Phone } from './phone.model';

export interface Receiver {
  name: string;
  address: Address;
  taxId?: string;
  type?: IssuerType;
  email?: string;
  phone?: Phone;
}
