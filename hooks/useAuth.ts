// Hook quản lý auth state: user, login, logout, isLoading
"use client";

export function useAuth() {
  // TODO: implement with context or zustand
  return {
    user: null,
    isLoading: false,
    login: async (_email: string, _password: string) => {},
    logout: async () => {},
  };
}
