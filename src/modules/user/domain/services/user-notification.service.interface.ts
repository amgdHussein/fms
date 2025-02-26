import { QueryFilter } from '../../../../core/queries';
import { Notification } from '../entities';

export interface IUserNotificationService {
  getNotification(userId: string): Promise<Notification>;
  getNotifications(userId: string, filters?: QueryFilter[], page?: number, limit?: number): Promise<Notification[]>;
  addNotification(userId: string, notification: Partial<Notification>): Promise<Notification>;
  updateNotification(userId: string, notification: Partial<Notification> & { id: string }): Promise<Notification>;
  deleteNotification(userId: string, id: string): Promise<Notification>;
  markNotificationAsRead(userId: string, id: string): Promise<Notification>;
  markNotificationAsUnread(userId: string, id: string): Promise<Notification>;
  markAllAsRead(userId: string): Promise<Notification[]>;
}
