import { QueryFilter, QueryOrder } from '../../../../core/models';

import { User, UserRole } from '../entities';

export interface IUserService {
  getUser(id: string): Promise<User>;
  getUsers(filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<User[]>;
  addUser(user: Partial<User> & { id: string }): Promise<User>;
  updateUser(user: Partial<User> & { id: string }): Promise<User>;
  deleteUser(id: string): Promise<User>;
  isUserActive(id: string): Promise<boolean>;

  registerUser(id: string, email: string, role: UserRole): Promise<User>;
}

export interface IUserAuthService {}
