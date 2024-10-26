import { Language, Phone } from '../../../../core/common';

export interface UserPreferences {
  id: string;
  userId: string; // User who created the user-preferences

  language: Language; // User preferred language
  email: string; // User preferred email to receive notifications
  phone?: Phone; // User preferred phone to receive notifications

  createdBy: string; // User who created the user-preferences
  createdAt: number; // Timestamp when the user-preferences was created
  updatedBy: string; // User who last updated the user-preferences
  updatedAt: number; // Timestamp when the user-preferences was last updated
}
