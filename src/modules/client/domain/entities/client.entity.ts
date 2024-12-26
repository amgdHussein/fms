import { Address, CurrencyCode, Identification, Phone } from '../../../../core/common';
import { ClientStatus } from './client-status.enum';

export interface Client {
  id: string;
  organizationId: string;

  name: string;
  email: string;
  status: ClientStatus;
  phone?: Phone;
  address: Address;
  identification: Identification;
  currency: CurrencyCode;

  createdBy: string; // User who created the client
  createdAt: number; // Timestamp when the client was created
  updatedBy: string; // User who last updated the client
  updatedAt: number; // Timestamp when the client was last updated
}
