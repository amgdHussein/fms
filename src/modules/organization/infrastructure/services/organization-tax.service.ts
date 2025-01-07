import { Inject, Injectable } from '@nestjs/common';

import { Authority } from '../../../../core/common';
import { BadRequestException, NotFoundException } from '../../../../core/exceptions';
import { IOrganizationTaxRepository, IOrganizationTaxService, ORGANIZATION_REPOSITORY_PROVIDER, OrganizationTax } from '../../domain';

@Injectable()
export class OrganizationTaxService implements IOrganizationTaxService {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY_PROVIDER)
    private readonly repo: IOrganizationTaxRepository,
  ) {}

  async getTax(id: string): Promise<OrganizationTax> {
    return this.repo.get(id);
  }

  async getOrganizationTax(organizationId: string, authority: Authority): Promise<OrganizationTax> {
    return this.repo
      .getMany([
        { key: 'organizationId', op: 'eq', value: organizationId },
        { key: 'authority', op: 'eq', value: authority },
      ])
      .then(taxes => {
        if (taxes.length) {
          return taxes[0];
        }

        throw new BadRequestException(`Organization has no taxes details with ${authority}!`);
      });
  }

  async getOrganizationTaxByTaxId(taxIdNo: string): Promise<OrganizationTax> {
    return this.repo.getMany([{ key: 'taxIdNo', op: 'eq', value: taxIdNo }]).then(taxes => {
      if (taxes.length) {
        return taxes[0];
      }

      throw new NotFoundException(`No organization with tax id ${taxIdNo}!`);
    });
  }

  async addTax(tax: Partial<OrganizationTax> & { organizationId: string; authority: Authority }): Promise<OrganizationTax> {
    return this.repo.add(tax);
  }

  async updateTax(tax: Partial<OrganizationTax> & { id: string }): Promise<OrganizationTax> {
    return this.repo.update(tax);
  }

  async deleteTax(id: string): Promise<OrganizationTax> {
    return this.repo.delete(id);
  }
}
