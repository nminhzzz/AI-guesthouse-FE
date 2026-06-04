import { apiClient } from "@/lib/apiClient";
import type { Room, RoomStatus, RoomType } from "@/types";

export interface AdminRoomListParams {
  page?: number;
  limit?: number;
  status?: RoomStatus | "";
  room_type?: RoomType | "";
  city?: string;
  district?: string;
  search?: string;
  sort_by?: "created_at" | "price" | "area" | "views";
  sort_order?: "asc" | "desc";
}

export interface AdminRoomListResponse {
  items: Room[];
  page: number;
  limit: number;
  total: number;
}

// Backend room routes trả raw JSON (không wrap ApiResponse)
const raw = { raw: true };

export const adminRoomApi = {
  /** GET /rooms/admin/list — tất cả phòng (admin) */
  listRooms: (params: AdminRoomListParams = {}): Promise<AdminRoomListResponse> => {
    const cleanParams: Record<string, unknown> = {};
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") cleanParams[k] = v;
    });
    return apiClient.get<AdminRoomListResponse>("/rooms/admin/list", { ...raw, params: cleanParams });
  },

  /** PATCH /rooms/admin/:id/approve */
  approveRoom: (id: string): Promise<Room> =>
    apiClient.patch<Room>(`/rooms/admin/${id}/approve`, undefined, raw),

  /** PATCH /rooms/admin/:id/reject */
  rejectRoom: (id: string): Promise<Room> =>
    apiClient.patch<Room>(`/rooms/admin/${id}/reject`, undefined, raw),

  /** PATCH /rooms/admin/:id/hide */
  hideRoom: (id: string): Promise<Room> =>
    apiClient.patch<Room>(`/rooms/admin/${id}/hide`, undefined, raw),

  /** PATCH /rooms/admin/:id/restore → pending */
  restoreRoom: (id: string): Promise<Room> =>
    apiClient.patch<Room>(`/rooms/admin/${id}/restore`, undefined, raw),

  /** DELETE /rooms/admin/:id */
  deleteRoom: (id: string): Promise<{ message: string }> =>
    apiClient.delete<{ message: string }>(`/rooms/admin/${id}`, raw),
};
