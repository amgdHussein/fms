import { AccountPreferences } from '../entities';

export interface IAccountPreferencesService {
  getPreferences(id: string): Promise<AccountPreferences>;
  addPreferences(preferences: Partial<AccountPreferences>): Promise<AccountPreferences>;
  updatePreferences(preferences: Partial<AccountPreferences> & { id: string }): Promise<AccountPreferences>;
  deletePreferences(id: string): Promise<AccountPreferences>;
}
