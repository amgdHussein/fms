import { Client, ClientStatus } from '../../domain';

import { Address, Identification, Phone } from '../../../../core/common';

// TODO: Fill the DTO
export class ClientDto implements Client {
  id: string;
  systemId: string;
  name: string;
  email: string;
  status: ClientStatus;
  phone?: Phone;
  address: Address;
  identification: Identification;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
