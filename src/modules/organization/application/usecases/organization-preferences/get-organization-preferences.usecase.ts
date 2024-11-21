import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IOrganizationPreferencesService, ORGANIZATION_PREFERENCES_SERVICE_PROVIDER, OrganizationPreferences } from '../../../domain';

@Injectable()
export class GetOrganizationPreferences implements Usecase<OrganizationPreferences> {
  constructor(
    @Inject(ORGANIZATION_PREFERENCES_SERVICE_PROVIDER)
    private readonly preferencesService: IOrganizationPreferencesService,
  ) {}

  async execute(id: string): Promise<OrganizationPreferences> {
    return this.preferencesService.getPreferences(id);
  }
}
