import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { BRANCH_SERVICE_PROVIDER, IOrganizationBranchService, OrganizationBranch } from '../../../domain';

@Injectable()
export class GetBranches implements Usecase<OrganizationBranch> {
  constructor(
    @Inject(BRANCH_SERVICE_PROVIDER)
    private readonly branchService: IOrganizationBranchService,
  ) {}

  async execute(systemId: string): Promise<OrganizationBranch[]> {
    return this.branchService.getBranches(systemId);
  }
}
