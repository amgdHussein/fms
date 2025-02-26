import { CurrencyCode } from '../../../../../core/enums';
import { Address, Phone } from '../../../../../core/models';
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

  openingBalance: number; // Array of opening balances
  totalInvoiceAmount: number;

  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
