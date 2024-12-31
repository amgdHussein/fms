import { Repository } from '../../../../core/interfaces';
import { QueryFilter } from '../../../../core/models';

import { Notification } from '../entities';

export interface IUserNotificationRepository extends Repository<Notification> {
  getMany(userId: string, filters?: QueryFilter[], page?: number, limit?: number): Promise<Notification[]>;
  updateMany(userId: string, notifications: (Partial<Notification> & { id: string })[]): Promise<Notification[]>;
}
