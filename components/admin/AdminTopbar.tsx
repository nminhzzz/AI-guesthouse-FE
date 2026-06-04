"use client";

import { Search, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useState } from "react";
import NotificationBell from "@/components/notifications/NotificationBell";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";

interface AdminTopbarProps {
  onMobileMenuToggle?: () => void;
}

export default function AdminTopbar({ onMobileMenuToggle }: AdminTopbarProps) {
  const { user } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-6 shadow-sm">
      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={onMobileMenuToggle}
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <NotificationBell onClick={() => setNotifOpen((v) => !v)} />
          <NotificationDropdown
            isOpen={notifOpen}
            onClose={() => setNotifOpen(false)}
          />
        </div>

        {/* Admin info */}
        <div className="flex items-center gap-2">
          {user?.avatar_url &&
          (user.avatar_url.startsWith("http") ||
            user.avatar_url.startsWith("/")) ? (
            <Image
              src={user.avatar_url}
              alt={user.name}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-none">
              {user?.name}
            </p>
            <p className="text-xs text-orange-500 font-medium mt-0.5">
              Quản trị viên
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
