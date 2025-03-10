import { CurrencyCode } from '../../../../../core/enums';
import { ClientPreferences } from '../../../domain/entities';

// TODO: FILL THE DTO
export class ClientPreferencesDto implements ClientPreferences {
  id: string;
  currencies: CurrencyCode[];
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}
