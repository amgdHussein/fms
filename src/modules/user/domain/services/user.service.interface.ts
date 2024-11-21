import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';

import { User, UserRole } from '../entities';

export interface IUserService {
  getUser(id: string): Promise<User>;
  getUsers(filters?: QueryFilter[]): Promise<User[]>;
  queryUsers(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<User>>;

  registerUser(id: string, email: string, role: UserRole): Promise<User>;
  addUser(user: Partial<User> & { id: string }): Promise<User>;
  updateUser(user: Partial<User> & { id: string }): Promise<User>;
  deleteUser(id: string): Promise<User>;

  isUserActive(id: string): Promise<boolean>;
}
