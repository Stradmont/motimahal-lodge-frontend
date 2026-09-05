export enum NotificationType {
  CONTACT_SUBMISSION = 'CONTACT_SUBMISSION',
  ROOM_INQUIRY = 'ROOM_INQUIRY',
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  referenceId?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationQueryParams {
  limit?: number;
  page?: number;
  isUnreadOnly?: boolean;
}
