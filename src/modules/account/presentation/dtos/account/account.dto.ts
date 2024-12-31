import { Phone } from '../../../../../core/common';
import { Account, AccountRole, AccountStatus, AccountType } from '../../../domain/entities';

// TODO: FILL THE DTO
export class AccountDto implements Account {
  id: string;
  userId: string;
  activeOrganizationId: string;
  status: AccountStatus;
  type: AccountType;
  role: AccountRole;
  startAt: number;
  endAt?: number;
  email?: string;
  phone?: Phone;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
