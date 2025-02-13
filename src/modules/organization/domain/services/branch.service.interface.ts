import { OrganizationBranch } from '../entities';

export interface IOrganizationBranchService {
  getBranches(organizationId: string): Promise<OrganizationBranch[]>;
  getBranch(id: string): Promise<OrganizationBranch>;
  addBranch(branch: Partial<OrganizationBranch> & { organizationId: string }): Promise<OrganizationBranch>;
  updateBranch(branch: Partial<OrganizationBranch> & { id: string }): Promise<OrganizationBranch>;
  deleteBranch(id: string): Promise<OrganizationBranch>;
  addBranches(branches: (Partial<OrganizationBranch> & { organizationId: string })[]): Promise<OrganizationBranch[]>;
}
