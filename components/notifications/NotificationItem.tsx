"use client";

import { Trash2 } from "lucide-react";
import type { Notification, NotificationType } from "@/lib/api/notificationApi";

// Icon và màu theo loại notification
const TYPE_CONFIG: Record<
  NotificationType,
  { emoji: string; color: string }
> = {
  room_approved:      { emoji: "✅", color: "bg-green-50" },
  room_rejected:      { emoji: "❌", color: "bg-red-50" },
  room_hidden:        { emoji: "🚫", color: "bg-orange-50" },
  room_rented:        { emoji: "🏠", color: "bg-blue-50" },
  new_message:        { emoji: "💬", color: "bg-purple-50" },
  room_favorited:     { emoji: "❤️", color: "bg-pink-50" },
  account_verified:   { emoji: "🎉", color: "bg-green-50" },
  account_suspended:  { emoji: "⚠️", color: "bg-yellow-50" },
  system:             { emoji: "📢", color: "bg-gray-50" },
};

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

interface Props {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({ notification, onRead, onDelete }: Props) {
  const config = TYPE_CONFIG[notification.type] ?? { emoji: "📢", color: "bg-gray-50" };

  return (
    <div
      className={`flex gap-3 px-4 py-3 cursor-pointer group transition-colors hover:bg-gray-50 ${
        !notification.is_read ? "bg-orange-50/40" : ""
      }`}
      onClick={() => !notification.is_read && onRead(notification.id)}
    >
      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base ${config.color}`}
      >
        {config.emoji}
      </div>

      {/* Nội dung */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${!notification.is_read ? "font-semibold text-gray-800" : "text-gray-700"}`}>
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
          {notification.body}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">
          {timeAgo(notification.created_at)}
        </p>
      </div>

      {/* Nút xóa + dot chưa đọc */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-400 transition-all rounded"
          aria-label="Xóa"
        >
          <Trash2 size={13} />
        </button>

        {!notification.is_read && (
          <span className="w-2 h-2 bg-orange-500 rounded-full mt-auto" />
        )}
      </div>
    </div>
  );
}
