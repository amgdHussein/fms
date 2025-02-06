import { Inject, Injectable } from '@nestjs/common';

import { QueryFilter, QueryOrder } from '../../../../core/models';
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

  async getBranches(organizationId: string, filters: QueryFilter[] = [], page?: number, limit?: number, order?: QueryOrder): Promise<OrganizationBranch[]> {
    return this.repo.getMany([{ key: 'organizationId', operator: 'eq', value: organizationId }, ...filters], page, limit, order);
  }

  async addBranch(branch: Partial<OrganizationBranch> & { organizationId: string }): Promise<OrganizationBranch> {
    return this.repo.add(branch);
  }

  async updateBranch(branch: Partial<OrganizationBranch> & { id: string }): Promise<OrganizationBranch> {
    return this.repo.update(branch);
  }

  async deleteBranch(id: string): Promise<OrganizationBranch> {
    return this.repo.delete(id);
  }
}
