"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  authApi,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api/authApi";
import type { User } from "@/types";

// ============================
// Types
// ============================
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ============================
// Context
// ============================
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Flag để tránh initAuth ghi đè state sau khi login() đã xong
  const isLoggingIn = useRef(false);

  const initAuth = useCallback(async () => {
    try {
      const user = await authApi.getMe();
      // Chỉ update nếu không đang trong quá trình login
      if (!isLoggingIn.current) {
        setState({ user, isLoading: false, isAuthenticated: true });
      }
    } catch {
      if (!isLoggingIn.current) {
        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // ============================
  // Actions
  // ============================
  const login = useCallback(async (data: LoginPayload) => {
    isLoggingIn.current = true;
    try {
      await authApi.login(data);
      const user = await authApi.getMe();
      setState({ user, isLoading: false, isAuthenticated: true });
    } finally {
      isLoggingIn.current = false;
    }
  }, []);

  const register = useCallback(async (data: RegisterPayload) => {
    await authApi.register(data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // bỏ qua lỗi network
    } finally {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      router.push("/");
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const user = await authApi.getMe();
      setState((prev) => ({ ...prev, user }));
    } catch {
      // silent fail
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================
// Hook
// ============================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}

export type { LoginPayload, RegisterPayload };
