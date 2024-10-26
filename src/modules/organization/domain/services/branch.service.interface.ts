import { OrganizationBranch } from '../entities';

export interface IOrganizationBranchService {
  getBranches(systemId: string): Promise<OrganizationBranch[]>;
  getBranch(id: string): Promise<OrganizationBranch>;
  addBranch(branch: Partial<OrganizationBranch>): Promise<OrganizationBranch>;
  updateBranch(branch: Partial<OrganizationBranch> & { id: string }): Promise<OrganizationBranch>;
  deleteBranch(id: string): Promise<OrganizationBranch>;
}
