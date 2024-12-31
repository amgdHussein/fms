import { Module } from '@nestjs/common';

import { AddAccount, DeleteAccount, GetAccount, GetOrganizationAccounts, GetUserAccounts, UpdateAccount } from './application';
import { ACCOUNT_REPOSITORY_PROVIDER, ACCOUNT_SERVICE_PROVIDER, ACCOUNT_USECASE_PROVIDERS } from './domain';
import { AccountFirestoreRepository, AccountService } from './infrastructure';
import { AccountController } from './presentation';

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
  {
    provide: ACCOUNT_USECASE_PROVIDERS.GET_ORGANIZATION_ACCOUNTS,
    useClass: GetOrganizationAccounts,
  },
  {
    provide: ACCOUNT_USECASE_PROVIDERS.GET_USER_ACCOUNTS,
    useClass: GetUserAccounts,
  },
];

@Module({
  imports: [],
  controllers: [AccountController],
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

    ...accountUsecases,
  ],
  exports: [
    {
      provide: ACCOUNT_SERVICE_PROVIDER,
      useClass: AccountService,
    },
  ],
})
export class AccountModule {}
