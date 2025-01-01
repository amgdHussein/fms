import { CountryTimezone, CurrencyCode } from '../../../../../core/common';
import { OrganizationPreferences } from '../../../domain/entities';

// TODO: FILL THE DTO
export class OrganizationPreferencesDto implements OrganizationPreferences {
  id: string;
  currencies: CurrencyCode[];
  financialDate: `${string}-${string}`;
  timezone: CountryTimezone;
  startWeekOn?: number;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
