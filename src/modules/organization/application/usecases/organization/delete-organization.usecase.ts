import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import {
  IOrganizationPreferencesService,
  IOrganizationService,
  Organization,
  ORGANIZATION_PREFERENCES_SERVICE_PROVIDER,
  ORGANIZATION_SERVICE_PROVIDER,
} from '../../../domain';

@Injectable()
export class DeleteOrganization implements Usecase<Organization> {
  constructor(
    @Inject(ORGANIZATION_SERVICE_PROVIDER)
    private readonly organizationService: IOrganizationService,

    @Inject(ORGANIZATION_PREFERENCES_SERVICE_PROVIDER)
    private readonly preferencesService: IOrganizationPreferencesService,
  ) {}

  async execute(id: string): Promise<Organization> {
    return this.organizationService.deleteOrganization(id).then(async organization => {
      // Delete organization related data
      await this.preferencesService.deletePreferences(id);

      return organization;
    });
  }
}
