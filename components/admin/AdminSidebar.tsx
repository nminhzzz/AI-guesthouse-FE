"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Home,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  BarChart2,
  Bell,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Quản lý phòng",
    href: "/admin/rooms",
    icon: Home,
  },
  {
    label: "Quản lý người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Thống kê",
    href: "/admin/analytics",
    icon: BarChart2,
  },
  {
    label: "Thông báo",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col h-screen bg-gray-900 text-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      } flex-shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-700/60">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sm leading-tight whitespace-nowrap">
            AI<span className="text-orange-400">Guesthouse</span>{" "}
            <span className="text-gray-400 font-normal">Admin</span>
          </span>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-20 w-6 h-6 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <ChevronRight size={12} />
        ) : (
          <ChevronLeft size={12} />
        )}
      </button>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all duration-150 group ${
                active
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile bottom */}
      <div className="border-t border-gray-700/60 p-3">
        <div
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          {user?.avatar_url &&
          (user.avatar_url.startsWith("http") ||
            user.avatar_url.startsWith("/")) ? (
            <Image
              src={user.avatar_url}
              alt={user.name}
              width={32}
              height={32}
              className="rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </div>
          )}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              title="Đăng xuất"
              className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
