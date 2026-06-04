import { apiClient, tokenStore } from "@/lib/apiClient";
import type { TokenResponse, UserResponse } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "user" | "owner";
}

export const authApi = {
  /**
   * POST /auth/login
   * Backend trả: { success, message, data: { access_token, token_type, csrf_token } }
   * → apiClient tự unwrap → TokenResponse
   */
  login: async (data: LoginPayload): Promise<TokenResponse> => {
    const res = await apiClient.post<TokenResponse>("/auth/login", data, {
      skipAuth: true,
    });
    tokenStore.setAccessToken(res.access_token);
    if (res.csrf_token) tokenStore.setCsrfToken(res.csrf_token);
    return res;
  },

  /**
   * POST /auth/register
   * Backend trả: { success, message, data: UserResponse }
   */
  register: async (data: RegisterPayload): Promise<UserResponse> => {
    return apiClient.post<UserResponse>("/auth/register", data, {
      skipAuth: true,
    });
  },

  /**
   * GET /auth/me — lấy user hiện tại bằng access token
   */
  getMe: (): Promise<UserResponse> =>
    apiClient.get<UserResponse>("/users/me"),

  /**
   * POST /auth/refresh-token — đã được xử lý tự động trong apiClient
   * Hàm này chỉ dùng khi gọi thủ công
   */
  refreshToken: async (): Promise<TokenResponse> => {
    const res = await apiClient.post<TokenResponse>("/auth/refresh");
    tokenStore.setAccessToken(res.access_token);
    if (res.csrf_token) tokenStore.setCsrfToken(res.csrf_token);
    return res;
  },

  /**
   * POST /auth/logout
   */
  logout: async (): Promise<void> => {
    await apiClient.post<void>("/auth/logout");
    tokenStore.clear();
  },
};
