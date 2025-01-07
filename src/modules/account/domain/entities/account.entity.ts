import { Phone } from '../../../../core/common';
import { AccountRole } from './account-role.enum';
import { AccountStatus } from './account-status.enum';
import { AccountType } from './account-type.enum';

export interface Account {
  id: string;
  userId: string;
  organizationId: string; // Organization that the account is currently active in

  status: AccountStatus;
  type: AccountType;
  role: AccountRole;

  startAt: number;
  endAt?: number; // Timestamp when the account will no longer be active

  email?: string;
  phone?: Phone;

  isProductionMode: boolean; // Whether the account is in production mode

  createdBy: string; // User who created the account
  createdAt: number; // Timestamp when the account was created
  updatedBy: string; // User who last updated the account
  updatedAt: number; // Timestamp when the account was last updated
}
