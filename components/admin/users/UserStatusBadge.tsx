"use client";

import { CheckCircle2, Ban } from "lucide-react";

interface UserStatusBadgeProps {
  isActive: boolean;
}

export default function UserStatusBadge({ isActive }: UserStatusBadgeProps) {
  if (isActive) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
        <CheckCircle2 size={12} /> Hoạt động
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200">
      <Ban size={12} className="text-gray-500" /> Bị khóa
    </div>
  );
}
