import { Module } from '@nestjs/common';

import { AddAccount, DeleteAccount, GetAccount, GetAccountPreferences, UpdateAccount, UpdateAccountPreferences } from './application';
import {
  ACCOUNT_PREFERENCES_REPOSITORY_PROVIDER,
  ACCOUNT_PREFERENCES_SERVICE_PROVIDER,
  ACCOUNT_PREFERENCES_USECASE_PROVIDERS,
  ACCOUNT_REPOSITORY_PROVIDER,
  ACCOUNT_SERVICE_PROVIDER,
  ACCOUNT_USECASE_PROVIDERS,
} from './domain';
import { AccountFirestoreRepository, AccountPreferencesFirestoreRepository, AccountPreferencesService, AccountService } from './infrastructure';
import { AccountController, AccountPreferencesController } from './presentation';

const validators = [];

const accountUsecases = [
  {
    provide: ACCOUNT_USECASE_PROVIDERS.GET_ACCOUNT,
    useClass: GetAccount,
  },
  {
    provide: ACCOUNT_USECASE_PROVIDERS.ADD_ACCOUNT,
    useClass: AddAccount,
  },
  {
    provide: ACCOUNT_USECASE_PROVIDERS.UPDATE_ACCOUNT,
    useClass: UpdateAccount,
  },
  {
    provide: ACCOUNT_USECASE_PROVIDERS.DELETE_ACCOUNT,
    useClass: DeleteAccount,
  },
];
const accountPreferencesUsecases = [
  {
    provide: ACCOUNT_PREFERENCES_USECASE_PROVIDERS.GET_ACCOUNT_PREFERENCES,
    useClass: GetAccountPreferences,
  },
  {
    provide: ACCOUNT_PREFERENCES_USECASE_PROVIDERS.UPDATE_ACCOUNT_PREFERENCES,
    useClass: UpdateAccountPreferences,
  },
];

@Module({
  imports: [],
  controllers: [AccountController, AccountPreferencesController],
  providers: [
    ...validators,

    {
      provide: ACCOUNT_REPOSITORY_PROVIDER,
      useClass: AccountFirestoreRepository,
    },
    {
      provide: ACCOUNT_SERVICE_PROVIDER,
      useClass: AccountService,
    },
    {
      provide: ACCOUNT_PREFERENCES_REPOSITORY_PROVIDER,
      useClass: AccountPreferencesFirestoreRepository,
    },
    {
      provide: ACCOUNT_PREFERENCES_SERVICE_PROVIDER,
      useClass: AccountPreferencesService,
    },

    ...accountUsecases,
    ...accountPreferencesUsecases,
  ],
  exports: [
    {
      provide: ACCOUNT_SERVICE_PROVIDER,
      useClass: AccountService,
    },
  ],
})
export class AccountModule {}
