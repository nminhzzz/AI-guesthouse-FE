// ============================
// Auth
// ============================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  csrf_token?: string;
}

// ============================
// User
// ============================
export type UserRole = "user" | "owner" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserResponse = User;

// ============================
// Room
// ============================
export type RoomType = "room" | "apartment" | "dormitory" | "house";
export type RoomStatus = "pending" | "active" | "rented" | "hidden" | "deleted";
export type GenderType = "all" | "male" | "female";
export type Amenity =
  | "wifi"
  | "parking"
  | "air_conditioner"
  | "refrigerator"
  | "washing_machine"
  | "private_bathroom"
  | "security_camera"
  | "elevator"
  | "balcony";

export interface RoomImage {
  public_id: string;
  url: string;
  width: number;
  height: number;
}

export interface Room {
  id: string;
  _id?: string; // Beanie đôi khi trả _id thay vì id
  title: string;
  description: string;
  room_type: RoomType;
  price: number;
  deposit: number;
  electricity_price: number;
  water_price: number;
  internet_price: number;
  service_price: number;
  area: number;
  address: string;
  ward: string;
  district: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  max_people: number;
  gender: GenderType;
  amenities: Amenity[];
  images: RoomImage[];
  thumbnail_index: number;
  owner_id: number;
  views: number;
  favorite_count: number;
  contact_count: number;
  status: RoomStatus;
  created_at: string;
  updated_at: string;
}

// ============================
// Common
// ============================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface RoomListResponse {
  items: Room[];
  page: number;
  limit: number;
  total: number;
}
