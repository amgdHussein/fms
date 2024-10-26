import { CurrencyCode } from '../../../../../core/common';
import { FinancialDate, OrganizationPreferences } from '../../../domain/entities';

// TODO: Fill the DTO
export class OrganizationPreferencesDto implements OrganizationPreferences {
  id: string;
  systemId: string;
  currencies: CurrencyCode[];
  financialDate: FinancialDate;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
