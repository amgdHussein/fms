import { Inject, Injectable } from '@nestjs/common';

import { Authority } from '../../../../../core/common';
import { Usecase } from '../../../../../core/interfaces';

import { IOrganizationTaxService, ORGANIZATION_TAX_SERVICE_PROVIDER, OrganizationTax } from '../../../domain';

@Injectable()
export class AddOrganizationTax implements Usecase<OrganizationTax> {
  constructor(
    @Inject(ORGANIZATION_TAX_SERVICE_PROVIDER)
    private readonly orgTaxService: IOrganizationTaxService,
  ) {}

  async execute(tax: Partial<OrganizationTax> & { organizationId: string; authority: Authority }): Promise<OrganizationTax> {
    return this.orgTaxService.addTax(tax);
  }
}
