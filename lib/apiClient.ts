/**
 * Base HTTP client cho AI Guesthouse API
 *
 * Backend trả về wrapper: { success, message, data }
 * Client này tự unwrap data và xử lý refresh token khi 401.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// In-memory access token (không lưu localStorage để tránh XSS)
let _accessToken: string | null = null;
let _csrfToken: string | null = null;
let _isRefreshing = false;
let _refreshQueue: Array<(token: string | null) => void> = [];

export const tokenStore = {
  setAccessToken: (t: string | null) => {
    _accessToken = t;
  },
  getAccessToken: () => _accessToken,
  setCsrfToken: (t: string | null) => {
    _csrfToken = t;
  },
  getCsrfToken: () => _csrfToken,
  clear: () => {
    _accessToken = null;
    _csrfToken = null;
  },
};

type RequestOptions = {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  /** Bỏ qua auth header (dùng cho login/register) */
  skipAuth?: boolean;
  /** Bỏ qua unwrap ApiResponse (cho các endpoint không dùng wrapper) */
  raw?: boolean;
};

// Backend ApiResponse wrapper
interface BackendResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
  _retry = false,
): Promise<T> {
  let url = `${BASE_URL}${path}`;

  if (options.params) {
    const qs = new URLSearchParams(
      Object.entries(options.params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => [k, String(v)]),
    ).toString();
    if (qs) url += `?${qs}`;
  }

  const isFormData = body instanceof FormData;
  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (!options.skipAuth && _accessToken) {
    headers["Authorization"] = `Bearer ${_accessToken}`;
  }

  let currentCsrf = _csrfToken;
  if (!currentCsrf && typeof document !== "undefined") {
    currentCsrf = document.cookie.match(/(^|;\s*)csrf_token=([^;]+)/)?.[2] || null;
    if (currentCsrf) _csrfToken = currentCsrf;
  }

  // CSRF token cho mutating requests (backend yêu cầu header X-CSRF-Token)
  if (isMutating && currentCsrf) {
    headers["X-CSRF-Token"] = currentCsrf;
  }

  const res = await fetch(url, {
    method,
    credentials: "include", // gửi cookies (refresh_token, csrf_token)
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  // --- 401: thử refresh token 1 lần ---
  if (res.status === 401 && !_retry && !options.skipAuth) {
    const newToken = await _doRefresh();
    if (newToken) {
      return request<T>(method, path, body, options, true);
    }
    // refresh thất bại → clear auth
    tokenStore.clear();
    throw new ApiError(401, "Session expired. Please login again.");
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const detail = payload?.detail ?? payload?.message ?? res.statusText;
    throw new ApiError(res.status, detail);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const payload = await res.json();

  // Unwrap { success, message, data } nếu đúng dạng wrapper
  if (
    !options.raw &&
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    ("success" in payload || "message" in payload)
  ) {
    const wrapped = payload as BackendResponse<T>;
    if (wrapped.success === false) {
      throw new ApiError(res.status, wrapped.message ?? "Unknown error");
    }
    return wrapped.data;
  }

  return payload as T;
}

// Xử lý refresh token — chỉ 1 request tại một thời điểm
async function _doRefresh(): Promise<string | null> {
  if (_isRefreshing) {
    return new Promise<string | null>((resolve) => {
      _refreshQueue.push(resolve);
    });
  }

  _isRefreshing = true;
  try {
    let currentCsrf = _csrfToken;
    if (!currentCsrf && typeof document !== "undefined") {
      currentCsrf =
        document.cookie.match(/(^|;\s*)csrf_token=([^;]+)/)?.[2] || null;
      if (currentCsrf) _csrfToken = currentCsrf;
    }

    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: currentCsrf ? { "X-CSRF-Token": currentCsrf } : {},
    });

    if (!res.ok) {
      if (res.status !== 401) {
        console.error("[apiClient] _doRefresh failed with status:", res.status);
      }
      try {
        const errPayload = await res.text();
        if (res.status !== 401) {
          console.error("[apiClient] _doRefresh error payload:", errPayload);
        }
        await fetch(`${BASE_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: currentCsrf ? { "X-CSRF-Token": currentCsrf } : {},
        });
      } catch (e) {
        // ignore
      }
      _refreshQueue.forEach((cb) => cb(null));
      _refreshQueue = [];
      return null;
    }

    const payload = await res.json();
    const data = payload?.data ?? payload;
    const newToken: string = data.access_token;
    const newCsrf: string = data.csrf_token;

    tokenStore.setAccessToken(newToken);
    tokenStore.setCsrfToken(newCsrf);

    _refreshQueue.forEach((cb) => cb(newToken));
    _refreshQueue = [];
    return newToken;
  } catch (err) {
    console.error("[apiClient] _doRefresh caught exception:", err);
    _refreshQueue.forEach((cb) => cb(null));
    _refreshQueue = [];
    return null;
  } finally {
    _isRefreshing = false;
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),
  delete: <T = void>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};
