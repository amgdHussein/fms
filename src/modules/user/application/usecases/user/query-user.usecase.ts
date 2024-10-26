import { Inject, Injectable } from '@nestjs/common';

import { Usecase } from '../../../../../core/interfaces';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../../core/models';

import { IUserService, User, USER_SERVICE_PROVIDER } from '../../../domain';

@Injectable()
export class QueryUsers implements Usecase<User> {
  constructor(
    @Inject(USER_SERVICE_PROVIDER)
    private readonly userService: IUserService,
  ) {}

  async execute(page = 1, limit = 10, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<User>> {
    return this.userService.queryUsers(page, limit, filters, order);
  }
}
