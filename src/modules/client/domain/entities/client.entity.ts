import { Address, CurrencyCode, Phone } from '../../../../core/common';
import { IssuerType } from '../../../../core/providers';
import { ClientStatus } from './client-status.enum';

export interface Client {
  id: string;
  organizationId: string;

  name: string;
  email: string;
  status: ClientStatus;
  phone?: Phone;
  address: Address;
  currency: CurrencyCode;

  identificationId: string; // Identification number
  type: IssuerType;

  // openingBalances?: OpeningBalance[]; // Array of opening balances

  createdBy: string; // User who created the client
  createdAt: number; // Timestamp when the client was created
  updatedBy: string; // User who last updated the client
  updatedAt: number; // Timestamp when the client was last updated
}

export interface OpeningBalance {
  id: string; // Unique ID for the opening balance entry
  organizationId: string; // Reference to the organization to which this balance belongs
  accountId: string; // Reference to the specific account
  accountType: AccountType; // Enum for account type (e.g., Asset, Liability, Equity, Revenue, Expense)

  currency: CurrencyCode; // Currency code for the balance (e.g., USD, EUR)
  amount: number; // Opening balance amount
  effectiveDate: string; // Date the balance is effective from

  createdBy: string; // User who created the opening balance
  createdAt: number; // Timestamp when the opening balance was created
  updatedBy?: string; // User who last updated the opening balance
  updatedAt?: number; // Timestamp when the opening balance was last updated
}

export enum AccountType {
  ASSET,
  LIABILITY,
  EQUITY,
  REVENUE,
  EXPENSE,
}
