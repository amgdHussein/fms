import { Inject, Injectable } from '@nestjs/common';

import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';

import { IUserRepository, IUserService, User, USER_REPOSITORY_PROVIDER, UserRole, UserStatus } from '../../domain';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly repo: IUserRepository,
  ) {}

  async getUser(id: string): Promise<User> {
    return this.repo.get(id);
  }

  async getUsers(filters?: QueryFilter[]): Promise<User[]> {
    return this.repo.getMany(filters);
  }

  async queryUsers(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<User>> {
    return this.repo.query(page, limit, filters, order);
  }

  async registerUser(id: string, email: string, role: UserRole = UserRole.USER): Promise<User> {
    return this.repo.set({
      id,
      email,
      status: UserStatus.REGISTERED,
      role,
      createdBy: id,
      createdAt: Date.now(),
    });
  }

  async addUser(user: Partial<User> & { id: string }): Promise<User> {
    user.status = UserStatus.ACTIVE;
    return this.repo.update(user);
  }

  async updateUser(user: Partial<User> & { id: string }): Promise<User> {
    return this.repo.update(user);
  }

  async deleteUser(id: string): Promise<User> {
    return this.repo.delete(id);
  }

  async isUserActive(id: string): Promise<boolean> {
    return this.repo
      .get(id)
      .then(user => user.status == UserStatus.ACTIVE)
      .catch(() => false);
  }
}
