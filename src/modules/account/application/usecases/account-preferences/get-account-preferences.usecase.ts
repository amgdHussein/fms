import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { ACCOUNT_PREFERENCES_SERVICE_PROVIDER, AccountPreferences, IAccountPreferencesService } from '../../../domain';

@Injectable()
export class GetAccountPreferences implements Usecase<AccountPreferences> {
  constructor(
    @Inject(ACCOUNT_PREFERENCES_SERVICE_PROVIDER)
    private readonly accountPreferencesService: IAccountPreferencesService,
  ) {}

  async execute(id: string): Promise<AccountPreferences> {
    return this.accountPreferencesService.getPreferences(id);
  }
}
