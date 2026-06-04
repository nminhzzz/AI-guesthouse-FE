"use client";

// Hook fetch danh sách phòng với phân trang
export function useRooms() {
  return {
    rooms: [],
    total: 0,
    page: 1,
    isLoading: false,
    error: null,
  };
}
