import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';
import { Account, ACCOUNT_SERVICE_PROVIDER, IAccountService } from '../../../../account/domain';

@Injectable()
export class GetUserAccounts implements Usecase<Account> {
  constructor(
    @Inject(ACCOUNT_SERVICE_PROVIDER)
    private readonly accountService: IAccountService,
  ) {}

  async execute(userId: string): Promise<Account[]> {
    return this.accountService.getUserAccounts(userId);
  }
}
