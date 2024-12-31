import { Global, Module } from '@nestjs/common';

import {
  AddUser,
  DeleteUser,
  GetUser,
  GetUserNotifications,
  GetUserPreferences,
  IsUserExistConstraint,
  MarkAllAsRead,
  MarkNotificationAsRead,
  MarkNotificationAsUnread,
  QueryUsers,
  RegisterUser,
  UpdateUser,
  UpdateUserPreferences,
} from './application';
import {
  USER_NOTIFICATION_REPOSITORY_PROVIDER,
  USER_NOTIFICATION_SERVICE_PROVIDER,
  USER_NOTIFICATION_USECASE_PROVIDERS,
  USER_PREFERENCES_REPOSITORY_PROVIDER,
  USER_PREFERENCES_SERVICE_PROVIDER,
  USER_PREFERENCES_USECASE_PROVIDERS,
  USER_REPOSITORY_PROVIDER,
  USER_SERVICE_PROVIDER,
  USER_USECASE_PROVIDERS,
} from './domain';
import {
  UserFirestoreRepository,
  UserNotificationFirestoreRepository,
  UserNotificationService,
  UserPreferencesFirestoreRepository,
  UserPreferencesService,
  UserService,
} from './infrastructure';
import { UserController, UserNotificationController, UserPreferencesController } from './presentation';

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
const userNotificationUsecases = [
  {
    provide: USER_NOTIFICATION_USECASE_PROVIDERS.GET_USER_NOTIFICATIONS,
    useClass: GetUserNotifications,
  },
  {
    provide: USER_NOTIFICATION_USECASE_PROVIDERS.MARK_AS_READ,
    useClass: MarkNotificationAsRead,
  },
  {
    provide: USER_NOTIFICATION_USECASE_PROVIDERS.MARK_AS_UNREAD,
    useClass: MarkNotificationAsUnread,
  },
  {
    provide: USER_NOTIFICATION_USECASE_PROVIDERS.MARK_ALL_AS_READ,
    useClass: MarkAllAsRead,
  },
];

@Global()
@Module({
  controllers: [UserController, UserPreferencesController, UserNotificationController],
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
    {
      provide: USER_NOTIFICATION_REPOSITORY_PROVIDER,
      useClass: UserNotificationFirestoreRepository,
    },
    {
      provide: USER_NOTIFICATION_SERVICE_PROVIDER,
      useClass: UserNotificationService,
    },

    ...userUsecases,
    ...userPreferencesUsecases,
    ...userNotificationUsecases,
  ],
})
export class UserModule {}
