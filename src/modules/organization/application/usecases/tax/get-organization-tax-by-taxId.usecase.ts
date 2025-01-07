import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IOrganizationTaxService, ORGANIZATION_TAX_SERVICE_PROVIDER, OrganizationTax } from '../../../domain';

@Injectable()
export class GetOrganizationTaxByTaxId implements Usecase<OrganizationTax> {
  constructor(
    @Inject(ORGANIZATION_TAX_SERVICE_PROVIDER)
    private readonly orgTaxService: IOrganizationTaxService,
  ) {}

  async execute(taxIdNo: string): Promise<OrganizationTax> {
    return this.orgTaxService.getOrganizationTaxByTaxId(taxIdNo);
  }
}
