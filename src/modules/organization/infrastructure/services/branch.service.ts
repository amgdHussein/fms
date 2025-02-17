import { Inject, Injectable } from '@nestjs/common';

import { QueryFilter, QueryOrder } from '../../../../core/models';
import { Branch, BRANCH_REPOSITORY_PROVIDER, IBranchRepository, IBranchService } from '../../domain';

@Injectable()
export class BranchService implements IBranchService {
  constructor(
    @Inject(BRANCH_REPOSITORY_PROVIDER)
    private readonly repo: IBranchRepository,
  ) {}

  async getBranch(id: string): Promise<Branch> {
    return this.repo.get(id);
  }

  async getBranches(organizationId: string, filters: QueryFilter[] = [], page?: number, limit?: number, order?: QueryOrder): Promise<Branch[]> {
    return this.repo.getMany([{ key: 'organizationId', operator: 'eq', value: organizationId }, ...filters], page, limit, order);
  }

  async addBranch(branch: Partial<Branch> & { organizationId: string }): Promise<Branch> {
    return this.repo.add(branch);
  }

  async addBranches(branches: (Partial<Branch> & { organizationId: string })[]): Promise<Branch[]> {
    return this.repo.addMany(branches);
  }

  async updateBranch(branch: Partial<Branch> & { id: string }): Promise<Branch> {
    return this.repo.update(branch);
  }

  async deleteBranch(id: string): Promise<Branch> {
    return this.repo.delete(id);
  }
}
