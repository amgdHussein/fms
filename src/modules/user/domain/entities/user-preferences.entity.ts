import { Language } from '../../../../core/enums';
import { Phone } from '../../../../core/models';

import { NotificationKey } from './notification-key.enum';
import { NotificationMethod } from './notification.entity';

export interface UserPreferences {
  id: string; // Same as user ID

  language: Language; // User preferred language
  email: string; // User preferred email to receive notifications
  phone?: Phone; // User preferred phone to receive notifications

  enabled: boolean; // Whether the user wants to receive notifications
  notifications: { key: NotificationKey; method: NotificationMethod }[]; // TODO: Define notification keys

  doNotDisturb: boolean; // Whether the user wants to be notified during do-not-disturb hours

  createdBy: string; // User who created the user-preferences
  createdAt: number; // Timestamp when the user-preferences was created
  updatedBy: string; // User who last updated the user-preferences
  updatedAt: number; // Timestamp when the user-preferences was last updated
}
