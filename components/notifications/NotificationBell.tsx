"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

interface Props {
  onClick: () => void;
  variant?: "light" | "dark"; // light = trên nền trắng, dark = trên nền tối
}

export default function NotificationBell({ onClick, variant = "light" }: Props) {
  const { unreadCount } = useNotifications();

  return (
    <button
      onClick={onClick}
      aria-label="Thông báo"
      className={`relative p-2 rounded-full transition-colors ${
        variant === "dark"
          ? "hover:bg-white/10 text-white"
          : "hover:bg-gray-100 text-gray-600"
      }`}
    >
      <Bell size={18} />

      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
