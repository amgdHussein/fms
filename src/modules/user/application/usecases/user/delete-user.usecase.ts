import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IUserPreferencesService, IUserService, User, USER_PREFERENCES_SERVICE_PROVIDER, USER_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class DeleteUser implements Usecase<User> {
  constructor(
    @Inject(USER_SERVICE_PROVIDER)
    private readonly userService: IUserService,

    @Inject(USER_PREFERENCES_SERVICE_PROVIDER)
    private readonly preferencesService: IUserPreferencesService,
  ) {}

  async execute(id: string): Promise<User> {
    return this.userService.deleteUser(id).then(async user => {
      // Delete user related data
      await this.preferencesService.deletePreferences(id);

      return user;
    });
  }
}
