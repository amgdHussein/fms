import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Language } from '../../../../../core/common';
import { IUserPreferencesService, IUserService, User, USER_PREFERENCES_SERVICE_PROVIDER, USER_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class AddUser implements Usecase<User> {
  constructor(
    @Inject(USER_SERVICE_PROVIDER)
    private readonly userService: IUserService,

    @Inject(USER_PREFERENCES_SERVICE_PROVIDER)
    private readonly preferencesService: IUserPreferencesService,
  ) {}

  async execute(user: Partial<User> & { id: string }): Promise<User> {
    return this.userService.addUser(user).then(async user => {
      // Add user related data
      await this.preferencesService.addPreferences({
        userId: user.id,
        email: user.email,
        language: Language.ENGLISH, // TODO: PASSED AS PARAMETER OR CALCULATED BASED ON USER'S NATIONALITY
      });

      return user;
    });
  }
}
