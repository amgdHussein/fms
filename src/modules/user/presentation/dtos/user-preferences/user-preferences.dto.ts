import { Language, Phone } from '../../../../../core/common';

import { UserPreferences } from '../../../domain';

// TODO: FILL THE DTO
export class UserPreferencesDto implements UserPreferences {
  id: string;
  userId: string;
  language: Language;
  email: string;
  phone?: Phone;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
