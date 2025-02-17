import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Branch, BRANCH_SERVICE_PROVIDER, IBranchService } from '../../../domain';

@Injectable()
export class DeleteBranch implements Usecase<Branch> {
  constructor(
    @Inject(BRANCH_SERVICE_PROVIDER)
    private readonly branchService: IBranchService,
  ) {}

  async execute(id: string): Promise<Branch> {
    return this.branchService.deleteBranch(id);
  }
}
