import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Authority } from '../../../../../core/common';
import { IOrganizationTaxService, ORGANIZATION_TAX_SERVICE_PROVIDER, OrganizationTax } from '../../../domain';

@Injectable()
export class ValidateAuthorityTaxNumber implements Usecase<OrganizationTax> {
  constructor(
    @Inject(ORGANIZATION_TAX_SERVICE_PROVIDER)
    private readonly orgTaxService: IOrganizationTaxService,
  ) {}

  async execute(taxIdNo: string, authority: Authority): Promise<OrganizationTax> {
    return this.orgTaxService.getTaxByTaxIdNumber(taxIdNo, authority);
  }
}
