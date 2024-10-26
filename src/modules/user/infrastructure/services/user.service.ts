import { Inject, Injectable } from '@nestjs/common';

import { LOCKER_PROVIDER } from '../../../../core/constants';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';
import { LockerService } from '../../../../core/providers';

import { IUserRepository, IUserService, User, USER_REPOSITORY_PROVIDER, UserRole, UserStatus } from '../../domain';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(LOCKER_PROVIDER)
    private readonly locker: LockerService,

    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly repo: IUserRepository,
  ) {}

  async getUser(id: string): Promise<User> {
    return this.repo.get(id);
  }

  async getUsers(filters?: QueryFilter[]): Promise<User[]> {
    return this.repo.getAll(filters);
  }

  async queryUsers(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<User>> {
    return this.repo.query(page, limit, filters, order);
  }

  async registerUser(id: string, email: string, role: UserRole = UserRole.USER): Promise<User> {
    return this.repo.set({ id, email, status: UserStatus.REGISTERED, role });
  }

  async addUser(user: Partial<User> & { id: string }): Promise<User> {
    // Initiate some fields
    user.status = UserStatus.ACTIVE;
    user.createdBy = this.locker.user.uid;
    user.createdAt = Date.now();
    user.updatedBy = this.locker.user.uid;
    user.updatedAt = Date.now();

    return this.repo.update(user);
  }

  async updateUser(user: Partial<User> & { id: string }): Promise<User> {
    // Update some fields
    user.updatedBy = this.locker.user.uid;
    user.updatedAt = Date.now();

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
