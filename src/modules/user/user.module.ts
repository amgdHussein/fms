import { Module } from '@nestjs/common';

import { AccountModule } from '../account/account.module';

import {
  AddUser,
  DeleteUser,
  GetUser,
  GetUserAccounts,
  GetUserPreferences,
  IsUserExistConstraint,
  QueryUsers,
  RegisterUser,
  UpdateUser,
  UpdateUserPreferences,
} from './application';
import {
  USER_PREFERENCES_REPOSITORY_PROVIDER,
  USER_PREFERENCES_SERVICE_PROVIDER,
  USER_PREFERENCES_USECASE_PROVIDERS,
  USER_REPOSITORY_PROVIDER,
  USER_SERVICE_PROVIDER,
  USER_USECASE_PROVIDERS,
} from './domain';
import { UserFirestoreRepository, UserPreferencesFirestoreRepository, UserPreferencesService, UserService } from './infrastructure';
import { UserController, UserPreferencesController } from './presentation';

const validators = [IsUserExistConstraint];
const userUsecases = [
  {
    provide: USER_USECASE_PROVIDERS.GET_USER,
    useClass: GetUser,
  },
  {
    provide: USER_USECASE_PROVIDERS.ADD_USER,
    useClass: AddUser,
  },
  {
    provide: USER_USECASE_PROVIDERS.REGISTER_USER,
    useClass: RegisterUser,
  },
  {
    provide: USER_USECASE_PROVIDERS.UPDATE_USER,
    useClass: UpdateUser,
  },
  {
    provide: USER_USECASE_PROVIDERS.QUERY_USERS,
    useClass: QueryUsers,
  },
  {
    provide: USER_USECASE_PROVIDERS.DELETE_USER,
    useClass: DeleteUser,
  },
  {
    provide: USER_USECASE_PROVIDERS.GET_USER_ACCOUNTS,
    useClass: GetUserAccounts,
  },
];
const userPreferencesUsecases = [
  {
    provide: USER_PREFERENCES_USECASE_PROVIDERS.GET_USER_PREFERENCES,
    useClass: GetUserPreferences,
  },
  {
    provide: USER_PREFERENCES_USECASE_PROVIDERS.UPDATE_USER_PREFERENCES,
    useClass: UpdateUserPreferences,
  },
];

@Module({
  imports: [AccountModule],
  controllers: [UserController, UserPreferencesController],
  providers: [
    ...validators,

    {
      provide: USER_REPOSITORY_PROVIDER,
      useClass: UserFirestoreRepository,
    },
    {
      provide: USER_SERVICE_PROVIDER,
      useClass: UserService,
    },
    {
      provide: USER_PREFERENCES_REPOSITORY_PROVIDER,
      useClass: UserPreferencesFirestoreRepository,
    },
    {
      provide: USER_PREFERENCES_SERVICE_PROVIDER,
      useClass: UserPreferencesService,
    },

    ...userUsecases,
    ...userPreferencesUsecases,
  ],
})
export class UserModule {}
