import type { Amenity, GenderType } from "@/types";

// Danh sách đối tượng cho thuê với label tiếng Việt
export const GENDER_LABELS: Record<GenderType, string> = {
  all: "Tất cả đối tượng",
  male: "Chỉ nam",
  female: "Chỉ nữ",
};

// Danh sách tiện ích với label tiếng Việt
export const AMENITY_LABELS: Record<Amenity, string> = {
  wifi: "WiFi",
  parking: "Chỗ đậu xe",
  air_conditioner: "Điều hòa",
  refrigerator: "Tủ lạnh",
  washing_machine: "Máy giặt",
  private_bathroom: "Phòng tắm riêng",
  security_camera: "Camera an ninh",
  elevator: "Thang máy",
  balcony: "Ban công",
};

// Danh sách loại phòng
export const ROOM_TYPE_LABELS = {
  room: "Phòng trọ",
  apartment: "Chung cư mini",
  dormitory: "Ký túc xá",
  house: "Nhà nguyên căn",
} as const;

// Danh sách trạng thái phòng
export const ROOM_STATUS_LABELS = {
  pending: "Chờ duyệt",
  active: "Hoạt động",
  rented: "Đã cho thuê",
  hidden: "Đã ẩn",
  deleted: "Đã xóa",
} as const;

// Danh sách role
export const USER_ROLE_LABELS = {
  user: "Người dùng",
  owner: "Chủ nhà",
  admin: "Quản trị viên",
} as const;
