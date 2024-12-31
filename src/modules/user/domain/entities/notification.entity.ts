export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  status: NotificationStatus;
  image?: string; // Image URL
  url?: string; // URL to redirect to
  data?: Record<string, string | number | object>; // Data to pass to the URL
  createdAt: number;
  createdBy: string;
  updatedAt: number;
  updatedBy: string;
}

export enum NotificationStatus {
  READ = 'read',
  UNREAD = 'unread',
}

export enum NotificationMethod {
  NONE = 'none',
  EMAIL = 'email',
  SMS = 'sms',
  BOTH = 'both',
}
