import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { Language } from '../../../../../core/common';
import { IUserPreferencesService, IUserService, User, USER_PREFERENCES_SERVICE_PROVIDER, USER_SERVICE_PROVIDER, UserRole } from '../../../domain';

@Injectable()
export class RegisterUser implements Usecase<User> {
  constructor(
    @Inject(USER_SERVICE_PROVIDER)
    private readonly userService: IUserService,

    @Inject(USER_PREFERENCES_SERVICE_PROVIDER)
    private readonly preferencesService: IUserPreferencesService,
  ) {}

  async execute(id: string, email: string, role: UserRole): Promise<User> {
    // return this.userService.registerUser(id, email, role);
    return this.userService.registerUser(id, email, role).then(async user => {
      // Add user related data
      await this.preferencesService.setPreferences({
        id: user.id,
        email: user.email,
        language: Language.ENGLISH, // TODO: PASSED AS PARAMETER OR CALCULATED BASED ON USER'S NATIONALITY
      });

      return user;
    });
  }
}
