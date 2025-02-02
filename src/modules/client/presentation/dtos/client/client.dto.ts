import { Address, CurrencyCode, Phone } from '../../../../../core/common';
import { IssuerType } from '../../../../../core/providers';
import { Client, ClientStatus } from '../../../domain';

// TODO: FILL THE DTO
export class ClientDto implements Client {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  status: ClientStatus;
  phone?: Phone;
  address: Address;
  identificationId: string; // Identification number
  type: IssuerType;
  currency: CurrencyCode;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
