"use client";

import { RoomStatus } from "@/types";

interface RoomStatusBadgeProps {
  status: RoomStatus | string;
}

const STATUS_MAP: Record<
  string,
  { label: string; className: string }
> = {
  active: {
    label: "Đang hiển thị",
    className: "bg-green-100 text-green-700",
  },
  pending: {
    label: "Chờ duyệt",
    className: "bg-yellow-100 text-yellow-700",
  },
  rented: {
    label: "Đã cho thuê",
    className: "bg-blue-100 text-blue-700",
  },
  hidden: {
    label: "Đã ẩn",
    className: "bg-gray-100 text-gray-500",
  },
  deleted: {
    label: "Đã xóa",
    className: "bg-red-100 text-red-600",
  },
};

export default function RoomStatusBadge({ status }: RoomStatusBadgeProps) {
  const config = STATUS_MAP[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
