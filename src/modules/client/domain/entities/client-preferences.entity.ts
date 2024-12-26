import { CurrencyCode } from '../../../../core/common';

export interface ClientPreferences {
  id: string;
  clientId: string;

  currencies: CurrencyCode[]; // Currencies supported by the organization

  createdBy: string; // User ID who created the preferences
  createdAt: number; // Date when the preferences was created
  updatedBy: string; // User ID who last updated the preferences
  updatedAt: number; // Date when the preferences was last updated
}
