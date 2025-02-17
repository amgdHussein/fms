import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Branch, BRANCH_SERVICE_PROVIDER, IBranchService } from '../../../domain';

@Injectable()
export class UpdateBranch implements Usecase<Branch> {
  constructor(
    @Inject(BRANCH_SERVICE_PROVIDER)
    private readonly branchService: IBranchService,
  ) {}

  async execute(branch: Partial<Branch> & { id: string }): Promise<Branch> {
    return this.branchService.updateBranch(branch);
  }
}
