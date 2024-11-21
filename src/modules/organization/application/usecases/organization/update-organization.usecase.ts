import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IOrganizationService, Organization, ORGANIZATION_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class UpdateOrganization implements Usecase<Organization> {
  constructor(
    @Inject(ORGANIZATION_SERVICE_PROVIDER)
    private readonly organizationService: IOrganizationService,
  ) {}

  async execute(organization: Partial<Organization> & { id: string }): Promise<Organization> {
    return this.organizationService.updateOrganization(organization);
  }
}
