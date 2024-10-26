import { Phone } from '../../../../../core/common';
import { AccountPreferences } from '../../../domain';

// TODO: Fill the DTO
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
