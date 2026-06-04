import { apiClient } from "../apiClient";
import type { User, PaginatedResponse } from "@/types";

export const userApi = {
  // Admin only
  getUsers: (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: string;
    is_active?: boolean;
    sort_by?: string;
    sort_order?: string;
  }) => apiClient.get<PaginatedResponse<User>>("/users", { params }),

  getUserById: (id: number) =>
    apiClient.get<User>(`/users/${id}`),

  createUser: (formData: FormData) =>
    apiClient.post<User>("/users", formData),

  updateUser: (id: number, formData: FormData) =>
    apiClient.put<User>(`/users/${id}`, formData),

  deleteUser: (id: number, hardDelete = false) =>
    apiClient.delete(`/users/${id}?hard_delete=${hardDelete}`),

  // Authenticated user
  getMe: () => apiClient.get<User>("/users/me"),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiClient.post<User>("/users/me/avatar", formData);
  },
};
