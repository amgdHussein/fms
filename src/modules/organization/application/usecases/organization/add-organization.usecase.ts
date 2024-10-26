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
export class AddOrganization implements Usecase<Organization> {
  constructor(
    @Inject(ORGANIZATION_SERVICE_PROVIDER)
    private readonly organizationService: IOrganizationService,

    @Inject(ORGANIZATION_PREFERENCES_SERVICE_PROVIDER)
    private readonly preferencesService: IOrganizationPreferencesService,
  ) {}

  async execute(organization: Partial<Organization> & { userId: string }): Promise<Organization> {
    return this.organizationService.addOrganization(organization).then(async org => {
      // Add organization related data
      await this.preferencesService.addPreferences({
        id: org.id,
        systemId: org.systemId,
        currencies: organization.currency ? [organization.currency] : [],
      });

      // TODO: ADD ORGANIZATION OWNER ACCOUNT
      return org;
    });
  }
}
