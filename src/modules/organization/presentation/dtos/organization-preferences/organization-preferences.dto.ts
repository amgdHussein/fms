import { CurrencyCode } from '../../../../../core/common';
import { FinancialDate, OrganizationPreferences } from '../../../domain/entities';

// TODO: FILL THE DTO
export class OrganizationPreferencesDto implements OrganizationPreferences {
  id: string;
  organizationId: string;
  currencies: CurrencyCode[];
  financialDate: FinancialDate;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
