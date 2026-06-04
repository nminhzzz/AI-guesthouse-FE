"use client";

import { Shield, ShieldAlert, User } from "lucide-react";

interface UserRoleBadgeProps {
  role: string;
}

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
  switch (role) {
    case "admin":
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
          <ShieldAlert size={12} /> Quản trị viên
        </div>
      );
    case "owner":
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
          <Shield size={12} /> Chủ trọ
        </div>
      );
    default:
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 text-xs font-medium border border-gray-200">
          <User size={12} /> Người dùng
        </div>
      );
  }
}
