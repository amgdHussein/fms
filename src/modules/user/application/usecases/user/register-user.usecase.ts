import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IUserService, User, USER_SERVICE_PROVIDER, UserRole } from '../../../domain';

@Injectable()
export class RegisterUser implements Usecase<User> {
  constructor(
    @Inject(USER_SERVICE_PROVIDER)
    private readonly userService: IUserService,
  ) {}

  async execute(id: string, email: string, role: UserRole): Promise<User> {
    return this.userService.registerUser(id, email, role);
  }
}
