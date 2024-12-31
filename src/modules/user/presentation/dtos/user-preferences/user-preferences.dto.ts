import { Language, Phone } from '../../../../../core/common';

import { NotificationKey, NotificationMethod, UserPreferences } from '../../../domain';

// TODO: FILL THE DTO
export class UserPreferencesDto implements UserPreferences {
  id: string;
  language: Language;
  email: string;
  phone?: Phone;
  enabled: boolean;
  notifications: { key: NotificationKey; method: NotificationMethod }[];
  doNotDisturb: boolean;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
