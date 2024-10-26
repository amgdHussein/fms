import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';

import { IUserService, User, USER_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class GetUser implements Usecase<User> {
  constructor(
    @Inject(USER_SERVICE_PROVIDER)
    private readonly userService: IUserService,
  ) {}

  async execute(id: string): Promise<User> {
    return this.userService.getUser(id);
  }
}
