import { AccountRole } from './account-role.enum';

export interface Invitation {
  id: string;
  userId: string;
  accountId: string;
  systemId: string;
  name: string;
  email: string;
  status: InvitationStatus;
  role: AccountRole;
  code: string;
  comment: string;
  expireAt: number;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}

export enum InvitationStatus {
  PENDING = 0,
  ACCEPTED = 1,
  EXPIRED = 2,
}
