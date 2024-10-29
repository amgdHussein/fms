import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';
import { Account, ACCOUNT_SERVICE_PROVIDER, IAccountService } from '../../../domain';

@Injectable()
export class GetOrganizationAccounts implements Usecase<Account> {
  constructor(
    @Inject(ACCOUNT_SERVICE_PROVIDER)
    private readonly accountService: IAccountService,
  ) {}

  async execute(systemId: string): Promise<Account[]> {
    return this.accountService.getOrganizationAccounts(systemId);
  }
}
