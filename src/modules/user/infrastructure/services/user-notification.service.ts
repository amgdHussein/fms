import { Inject, Injectable } from '@nestjs/common';

import { QueryFilter } from '../../../../core/models';
import { IUserNotificationRepository, IUserNotificationService, Notification, NotificationStatus, USER_NOTIFICATION_REPOSITORY_PROVIDER } from '../../domain';

@Injectable()
export class UserNotificationService implements IUserNotificationService {
  constructor(
    @Inject(USER_NOTIFICATION_REPOSITORY_PROVIDER)
    private readonly repo: IUserNotificationRepository,
  ) {}

  async getNotification(id: string): Promise<Notification> {
    return this.repo.get(id);
  }

  async getNotifications(userId: string, filters?: QueryFilter[], page?: number, limit?: number): Promise<Notification[]> {
    return this.repo.getMany(userId, filters, page, limit);
  }

  async addNotification(userId: string, notification: Partial<Notification>): Promise<Notification> {
    return this.repo.add(notification, userId);
  }

  async updateNotification(userId: string, notification: Partial<Notification> & { id: string }): Promise<Notification> {
    return this.repo.update(notification, userId);
  }

  async deleteNotification(userId: string, id: string): Promise<Notification> {
    return this.repo.delete(id, userId);
  }

  async markNotificationAsRead(userId: string, id: string): Promise<Notification> {
    return this.repo.update({ id, status: NotificationStatus.READ }, userId);
  }

  async markNotificationAsUnread(userId: string, id: string): Promise<Notification> {
    return this.repo.update({ id, status: NotificationStatus.UNREAD }, userId);
  }

  async markAllAsRead(userId: string): Promise<Notification[]> {
    const notifications = await this.repo.getMany(userId, [{ key: 'status', op: 'neq', value: NotificationStatus.READ }]);

    notifications.forEach(notification => {
      notification.status = NotificationStatus.READ;
    });

    return this.repo.updateMany(userId, notifications);
  }
}
