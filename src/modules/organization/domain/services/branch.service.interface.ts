import { Branch } from '../entities';

export interface IBranchService {
  getBranches(organizationId: string): Promise<Branch[]>;
  getBranch(id: string): Promise<Branch>;
  addBranch(branch: Partial<Branch> & { organizationId: string }): Promise<Branch>;
  updateBranch(branch: Partial<Branch> & { id: string }): Promise<Branch>;
  deleteBranch(id: string): Promise<Branch>;
  addBranches(branches: (Partial<Branch> & { organizationId: string })[]): Promise<Branch[]>;
}
