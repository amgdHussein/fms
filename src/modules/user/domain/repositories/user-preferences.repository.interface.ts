import { Repository } from '../../../../core/interfaces';

import { UserPreferences } from '../entities';

export interface IUserPreferencesRepository extends Repository<UserPreferences> {
  set(preferences: Partial<UserPreferences> & { id: string }): Promise<UserPreferences>;
}
