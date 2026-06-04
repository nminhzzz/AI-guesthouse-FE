import { apiClient } from "@/lib/apiClient";

export interface DashboardStats {
  total_users: number;
  total_rooms: number;
  total_active_rooms: number;
  total_pending_rooms: number;
  total_rented_rooms: number;
  total_views_today: number;
  new_users_today: number;
  new_rooms_today: number;
  revenue_estimate: number;
}

export interface RecentRoom {
  id: string;
  title: string;
  address: string;
  price: number;
  status: string;
  created_at: string;
  owner_id: number;
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const adminApi = {
  /** GET /admin/stats */
  getDashboardStats: (): Promise<DashboardStats> =>
    apiClient.get<DashboardStats>("/admin/stats"),

  /** GET /admin/rooms/recent */
  getRecentRooms: (limit = 5): Promise<RecentRoom[]> =>
    apiClient.get<RecentRoom[]>("/admin/rooms/recent", { params: { limit } }),

  /** GET /admin/users/recent */
  getRecentUsers: (limit = 5): Promise<RecentUser[]> =>
    apiClient.get<RecentUser[]>("/admin/users/recent", { params: { limit } }),

  /** PATCH /admin/rooms/{id}/approve */
  approveRoom: (id: string): Promise<void> =>
    apiClient.patch(`/admin/rooms/${id}/approve`),

  /** PATCH /admin/rooms/{id}/reject */
  rejectRoom: (id: string): Promise<void> =>
    apiClient.patch(`/admin/rooms/${id}/reject`),
};
