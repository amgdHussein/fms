import { Phone } from '../../../../../core/common';
import { AccountPreferences } from '../../../domain';

// TODO: FILL THE DTO
export class AccountPreferencesDto implements AccountPreferences {
  id: string;
  accountId: string;
  activeSystemId: string;
  email?: string;
  phone?: Phone;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
