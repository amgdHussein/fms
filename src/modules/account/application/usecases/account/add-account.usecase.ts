import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Account, ACCOUNT_PREFERENCES_SERVICE_PROVIDER, ACCOUNT_SERVICE_PROVIDER, IAccountPreferencesService, IAccountService } from '../../../domain';

@Injectable()
export class AddAccount implements Usecase<Account> {
  constructor(
    @Inject(ACCOUNT_SERVICE_PROVIDER)
    private readonly accountService: IAccountService,

    @Inject(ACCOUNT_PREFERENCES_SERVICE_PROVIDER)
    private readonly preferencesService: IAccountPreferencesService,
  ) {}

  async execute(account: Partial<Account>): Promise<Account> {
    return this.accountService.addAccount(account).then(async account => {
      // Add account related data
      await this.preferencesService.addPreferences({
        accountId: account.id,
      });

      return account;
    });
  }
}
