import { CurrencyCode } from '../../../../core/common';

export interface OrganizationPreferences {
  id: string;
  organizationId: string;

  currencies: CurrencyCode[]; // Currencies supported by the organization
  financialDate: FinancialDate; // Custom type for date without year

  createdBy: string; // User ID who created the preferences
  createdAt: number; // Date when the preferences was created
  updatedBy: string; // User ID who last updated the preferences
  updatedAt: number; // Date when the preferences was last updated
}

// FinancialDate is a string in "MM-DD" format, representing month and day
export type FinancialDate = `${string}-${string}`; // Restricts to "MM-DD" format, you could use regex validation to be more precise.
