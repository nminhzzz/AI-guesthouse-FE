"use client";

import { Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";

interface UserFiltersProps {
  onFilterChange: (filters: {
    search: string;
    role: string;
    is_active: string; // 'all', 'true', 'false'
  }) => void;
}

export default function UserFilters({ onFilterChange }: UserFiltersProps) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [isActive, setIsActive] = useState("all");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({
        search,
        role: role === "all" ? "" : role,
        is_active: isActive,
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [search, role, isActive, onFilterChange]);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Filter size={16} /> Lọc:
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="user">Người dùng thường</option>
          <option value="owner">Chủ trọ</option>
          <option value="admin">Quản trị viên</option>
        </select>

        <select
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        >
          <option value="all">Mọi trạng thái</option>
          <option value="true">Đang hoạt động</option>
          <option value="false">Bị khóa</option>
        </select>
      </div>
    </div>
  );
}
