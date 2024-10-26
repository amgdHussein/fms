import { OrganizationPreferences } from '../entities';

export interface IOrganizationPreferencesService {
  getPreferences(id: string): Promise<OrganizationPreferences>;
  addPreferences(preferences: Partial<OrganizationPreferences>): Promise<OrganizationPreferences>;
  updatePreferences(preferences: Partial<OrganizationPreferences> & { id: string }): Promise<OrganizationPreferences>;
  deletePreferences(id: string): Promise<OrganizationPreferences>;
}
