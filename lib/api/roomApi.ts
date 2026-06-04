import { apiClient } from "@/lib/apiClient";
import type { Room, RoomListResponse } from "@/types";

export interface SearchRoomsParams {
  district?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export const roomApi = {
  /** GET /rooms?page=&limit= */
  getRooms: (page = 1, limit = 10): Promise<RoomListResponse> =>
    apiClient.get<RoomListResponse>("/rooms", { params: { page, limit } }),

  /** GET /rooms/{id} */
  getRoomById: (id: string): Promise<Room> =>
    apiClient.get<Room>(`/rooms/${id}`),

  /** GET /rooms/search/filter */
  searchRooms: (params: SearchRoomsParams): Promise<RoomListResponse> =>
    apiClient.get<RoomListResponse>("/rooms/search/filter", { params }),

  /** GET /rooms/my-rooms/list — owner only */
  getMyRooms: (): Promise<Room[]> =>
    apiClient.get<Room[]>("/rooms/my-rooms/list"),

  /** POST /rooms — multipart: room_data (JSON string) + images (3–6 files) */
  createRoom: (formData: FormData): Promise<Room> =>
    apiClient.post<Room>("/rooms", formData),

  /** PUT /rooms/{id} */
  updateRoom: (id: string, formData: FormData): Promise<Room> =>
    apiClient.put<Room>(`/rooms/${id}`, formData),

  /** PATCH /rooms/{id}/hide */
  hideRoom: (id: string): Promise<Room> =>
    apiClient.patch<Room>(`/rooms/${id}/hide`),

  /** PATCH /rooms/{id}/activate */
  activateRoom: (id: string): Promise<Room> =>
    apiClient.patch<Room>(`/rooms/${id}/activate`),

  /** DELETE /rooms/{id} — soft delete */
  deleteRoom: (id: string): Promise<void> =>
    apiClient.delete(`/rooms/${id}`),
};
