import { Account, AccountRole, AccountStatus, AccountType } from '../../../domain/entities';

// TODO: FILL THE DTO
export class AccountDto implements Account {
  id: string;
  userId: string;
  preferencesId: string;
  status: AccountStatus;
  type: AccountType;
  role: AccountRole;
  startAt: number;
  endAt?: number;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
