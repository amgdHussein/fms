import { Address, CurrencyCode, Identification, Phone } from '../../../../../core/common';
import { Client, ClientStatus } from '../../../domain';

// TODO: FILL THE DTO
export class ClientDto implements Client {
  isProductionMode: boolean;
  id: string;
  organizationId: string;
  name: string;
  email: string;
  status: ClientStatus;
  phone?: Phone;
  address: Address;
  identification: Identification;
  currency: CurrencyCode;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
