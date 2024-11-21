import { CurrencyCode } from '../../../../core/common';

export interface Plan {
  id: string;

  name: string;
  description: string;
  price: number;
  cycle: number;
  currency: CurrencyCode;

  // TODO: ADD FEATURES
  maxMembers: number; // Number of members supported by the plan
  maxClients: number; // Number of clients supported by the plan
  maxSubmissions: number; // Number of tax invoice submissions per month

  createdBy: string; // User who created the user-preferences
  createdAt: number; // Timestamp when the user-preferences was created
  updatedBy: string; // User who last updated the user-preferences
  updatedAt: number; // Timestamp when the user-preferences was last updated
}
