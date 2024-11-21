import { Inject, Injectable } from '@nestjs/common';

import {
  IOrganizationPreferencesRepository,
  IOrganizationPreferencesService,
  ORGANIZATION_PREFERENCES_REPOSITORY_PROVIDER,
  OrganizationPreferences,
} from '../../domain';

@Injectable()
export class OrganizationPreferencesService implements IOrganizationPreferencesService {
  constructor(
    @Inject(ORGANIZATION_PREFERENCES_REPOSITORY_PROVIDER)
    private readonly repo: IOrganizationPreferencesRepository,
  ) {}

  async getPreferences(id: string): Promise<OrganizationPreferences> {
    return this.repo.get(id);
  }

  async addPreferences(preferences: Partial<OrganizationPreferences> & { organizationId: string }): Promise<OrganizationPreferences> {
    return this.repo.add(preferences);
  }

  async updatePreferences(preferences: Partial<OrganizationPreferences> & { id: string }): Promise<OrganizationPreferences> {
    return this.repo.update(preferences);
  }

  async deletePreferences(id: string): Promise<OrganizationPreferences> {
    return this.repo.delete(id);
  }
}
