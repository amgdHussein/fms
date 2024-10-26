import { Phone } from '../../../../core/common';

export interface AccountPreferences {
  id: string;
  accountId: string;

  activeSystemId: string; // System that the account is currently active in
  email?: string; // Account preferred email to receive notifications
  phone?: Phone; // Account preferred phone to receive notifications

  createdBy: string; // User who created the preferences
  createdAt: number; // Timestamp when the preferences was created
  updatedBy: string; // User who last updated the preferences
  updatedAt: number; // Timestamp when the preferences was last updated
}
