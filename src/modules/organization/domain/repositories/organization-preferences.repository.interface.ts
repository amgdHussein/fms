import { Repository } from '../../../../core/interfaces';

import { OrganizationPreferences } from '../entities';

export interface IOrganizationPreferencesRepository extends Repository<OrganizationPreferences> {
  set(preferences: Partial<OrganizationPreferences> & { id: string }): Promise<OrganizationPreferences>;
}
