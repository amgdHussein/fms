import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { BRANCH_SERVICE_PROVIDER, IOrganizationBranchService, OrganizationBranch } from '../../../domain';

@Injectable()
export class DeleteBranch implements Usecase<OrganizationBranch> {
  constructor(
    @Inject(BRANCH_SERVICE_PROVIDER)
    private readonly branchService: IOrganizationBranchService,
  ) {}

  async execute(id: string): Promise<OrganizationBranch> {
    return this.branchService.deleteBranch(id);
  }
}
