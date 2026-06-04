"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { RoomStatus, RoomType } from "@/types";

export interface RoomFilterValues {
  search: string;
  status: RoomStatus | "";
  room_type: RoomType | "";
  city: string;
}

interface Props {
  onFilterChange: (filters: RoomFilterValues) => void;
}

const STATUS_OPTIONS: { label: string; value: RoomStatus | "" }[] = [
  { label: "Tất cả trạng thái", value: "" },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Đang hiển thị", value: "active" },
  { label: "Đã cho thuê", value: "rented" },
  { label: "Đã ẩn", value: "hidden" },
  { label: "Đã xóa", value: "deleted" },
];

const TYPE_OPTIONS: { label: string; value: RoomType | "" }[] = [
  { label: "Tất cả loại phòng", value: "" },
  { label: "Phòng trọ", value: "room" },
  { label: "Chung cư mini", value: "apartment" },
  { label: "Ký túc xá", value: "dormitory" },
  { label: "Nhà nguyên căn", value: "house" },
];

export default function RoomFilters({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<RoomFilterValues>({
    search: "",
    status: "",
    room_type: "",
    city: "",
  });

  const update = (patch: Partial<RoomFilterValues>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    onFilterChange(next);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, địa chỉ..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => update({ status: e.target.value as RoomStatus | "" })}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Room type */}
        <select
          value={filters.room_type}
          onChange={(e) => update({ room_type: e.target.value as RoomType | "" })}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* City */}
        <div className="relative">
          <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Thành phố..."
            value={filters.city}
            onChange={(e) => update({ city: e.target.value })}
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-36"
          />
        </div>
      </div>
    </div>
  );
}
