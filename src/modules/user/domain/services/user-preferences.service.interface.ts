import { UserPreferences } from '../entities';

export interface IUserPreferencesService {
  getPreferences(id: string): Promise<UserPreferences>;
  addPreferences(preferences: Partial<UserPreferences> & { userId: string }): Promise<UserPreferences>;
  updatePreferences(preferences: Partial<UserPreferences> & { id: string }): Promise<UserPreferences>;
  deletePreferences(id: string): Promise<UserPreferences>;
}
