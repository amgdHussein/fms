import { CurrencyCode, Cycle } from '../../../../core/enums';

export interface Plan {
  id: string;

  name: string;
  description: string;
  price: number;
  cycle: Cycle;
  currency: CurrencyCode;

  // TODO: ADD FEATURES
  // * When adding new features, must add them into the usage entity
  maxMembers: number; // Number of members supported by the plan
  maxClients: number; // Number of clients supported by the plan
  maxSubmissions: number; // Number of tax invoice submissions per month

  createdBy: string; // User who created the user-preferences
  createdAt: number; // Timestamp when the user-preferences was created
  updatedBy: string; // User who last updated the user-preferences
  updatedAt: number; // Timestamp when the user-preferences was last updated
}
