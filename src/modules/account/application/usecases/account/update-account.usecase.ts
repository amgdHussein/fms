import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Account, ACCOUNT_SERVICE_PROVIDER, IAccountService } from '../../../domain';

@Injectable()
export class UpdateAccount implements Usecase<Account> {
  constructor(
    @Inject(ACCOUNT_SERVICE_PROVIDER)
    private readonly accountService: IAccountService,
  ) {}

  async execute(account: Partial<Account> & { id: string }): Promise<Account> {
    return this.accountService.updateAccount(account);
  }
}
