import { apiClient, ApiResponse } from '@/lib/api-client';
import { NotificationItem, NotificationQueryParams } from '@/lib/types/notification';

export const NotificationService = {
  async getAll(params?: NotificationQueryParams): Promise<ApiResponse<NotificationItem[]>> {
    return apiClient.get<NotificationItem[]>('/api/v1/admin/notifications', params);
  },
  async getUnreadCount(): Promise<ApiResponse<{ unreadCount: number }>> {
    return apiClient.get<{ unreadCount: number }>('/api/v1/admin/notifications/unread-count');
  },
  async markAsRead(id: string): Promise<ApiResponse<NotificationItem>> {
    return apiClient.patch<NotificationItem>(`/api/v1/admin/notifications/${id}/read`);
  },
  async markAllAsRead(): Promise<ApiResponse<null>> {
    return apiClient.patch<null>('/api/v1/admin/notifications/read-all');
  },
  async deleteNotification(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/api/v1/admin/notifications/${id}`);
  },
};
