import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Account, ACCOUNT_PREFERENCES_SERVICE_PROVIDER, ACCOUNT_SERVICE_PROVIDER, IAccountPreferencesService, IAccountService } from '../../../domain';

@Injectable()
export class DeleteAccount implements Usecase<Account> {
  constructor(
    @Inject(ACCOUNT_SERVICE_PROVIDER)
    private readonly accountService: IAccountService,

    @Inject(ACCOUNT_PREFERENCES_SERVICE_PROVIDER)
    private readonly preferencesService: IAccountPreferencesService,
  ) {}

  async execute(id: string): Promise<Account> {
    return this.accountService.deleteAccount(id).then(async account => {
      // Delete account related data
      await this.preferencesService.deletePreferences(account.preferencesId);

      return account;
    });
  }
}
