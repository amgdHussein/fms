import { Address, Issuer, Phone } from '../models';

export class IssuerDto implements Issuer {
  name: string;
  address: Address;
  taxId?: string;
  commercialRegistryNo?: string;
  email?: string;
  phone?: Phone;
}
