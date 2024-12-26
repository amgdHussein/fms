import { ClientPreferences } from '../entities';

export interface IClientPreferencesService {
  getPreferences(id: string): Promise<ClientPreferences>;
  addPreferences(preferences: Partial<ClientPreferences> & { clientId: string }): Promise<ClientPreferences>;
  updatePreferences(preferences: Partial<ClientPreferences> & { id: string }): Promise<ClientPreferences>;
  deletePreferences(id: string): Promise<ClientPreferences>;
}
