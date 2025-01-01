import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../../core/models';

import { IUserService, User, USER_SERVICE_PROVIDER, UserStatus } from '../../../domain';

@Injectable()
export class QueryUsers implements Usecase<User> {
  constructor(
    @Inject(USER_SERVICE_PROVIDER)
    private readonly userService: IUserService,
  ) {}

  async execute(filters: QueryFilter[] = [], page = 1, limit = 10, order?: QueryOrder): Promise<User[]> {
    filters.push({ key: 'status', op: 'neq', value: UserStatus.DELETED });
    return this.userService.getUsers(filters, page, limit, order);
  }
}
