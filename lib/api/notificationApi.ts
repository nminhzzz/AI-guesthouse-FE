import { apiClient } from "@/lib/apiClient";

export type NotificationType =
  | "room_approved"
  | "room_rejected"
  | "room_hidden"
  | "room_rented"
  | "new_message"
  | "room_favorited"
  | "account_verified"
  | "account_suspended"
  | "system";

export interface Notification {
  id: string;
  user_id: number;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  unread_count: number;
  page: number;
  limit: number;
}

export const notificationApi = {
  getMyNotifications: (params?: {
    page?: number;
    limit?: number;
    unread_only?: boolean;
  }): Promise<NotificationListResponse> =>
    apiClient.get<NotificationListResponse>("/notifications", { params }),

  getUnreadCount: (): Promise<{ unread_count: number }> =>
    apiClient.get<{ unread_count: number }>("/notifications/unread-count"),

  markAsRead: (id: string): Promise<Notification> =>
    apiClient.patch<Notification>(`/notifications/${id}/read`),

  markAllAsRead: (): Promise<{ message: string }> =>
    apiClient.patch<{ message: string }>("/notifications/read-all"),

  deleteNotification: (id: string): Promise<{ message: string }> =>
    apiClient.delete<{ message: string }>(`/notifications/${id}`),
};
