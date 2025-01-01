import { Repository } from '../../../../core/interfaces';

import { ClientPreferences } from '../entities';

export interface IClientPreferencesRepository extends Repository<ClientPreferences> {
  set(preferences: Partial<ClientPreferences> & { id: string }): Promise<ClientPreferences>;
}
