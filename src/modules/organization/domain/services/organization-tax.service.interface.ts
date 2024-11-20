import { Authority } from '../../../../core/common';

import { OrganizationTax } from '../entities';

export interface IOrganizationTaxService {
  getTax(id: string): Promise<OrganizationTax>;
  getOrganizationTax(organizationId: string, authority: Authority): Promise<OrganizationTax>;
  addTax(tax: Partial<OrganizationTax> & { organizationId: string; authority: Authority }): Promise<OrganizationTax>;
  updateTax(tax: Partial<OrganizationTax> & { id: string }): Promise<OrganizationTax>;
  deleteTax(id: string): Promise<OrganizationTax>;
}
