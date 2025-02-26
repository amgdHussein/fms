import { Address, Phone, Receiver } from '../models';
import { IssuerType } from '../providers';

export class ReceiverDto implements Receiver {
  name: string;
  address: Address;
  taxId?: string;
  type?: IssuerType;
  email?: string;
  phone?: Phone;
}
