import { Notification, NotificationStatus } from '../../../domain';

// TODO: FILL THE DTO
export class UserNotificationDto implements Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  status: NotificationStatus;
  image?: string;
  url?: string;
  data?: Record<string, string | number | object>;
  createdAt: number;
  createdBy: string;
  updatedAt: number;
  updatedBy: string;
}
