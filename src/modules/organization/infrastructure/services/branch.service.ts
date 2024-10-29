import { Inject, Injectable } from '@nestjs/common';

import { BRANCH_REPOSITORY_PROVIDER, IOrganizationBranchRepository, IOrganizationBranchService, OrganizationBranch } from '../../domain';

@Injectable()
export class OrganizationBranchService implements IOrganizationBranchService {
  constructor(
    @Inject(BRANCH_REPOSITORY_PROVIDER)
    private readonly repo: IOrganizationBranchRepository,
  ) {}

  async getBranch(id: string): Promise<OrganizationBranch> {
    return this.repo.get(id);
  }

  async getBranches(systemId: string): Promise<OrganizationBranch[]> {
    return this.repo.getMany([{ key: 'systemId', op: 'eq', value: systemId }]);
  }

  async addBranch(branch: Partial<OrganizationBranch> & { systemId: string }): Promise<OrganizationBranch> {
    return this.repo.add(branch);
  }

  async updateBranch(branch: Partial<OrganizationBranch> & { id: string }): Promise<OrganizationBranch> {
    return this.repo.update(branch);
  }

  async deleteBranch(id: string): Promise<OrganizationBranch> {
    return this.repo.delete(id);
  }
}
