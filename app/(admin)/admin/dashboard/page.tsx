"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Home,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  MapPin,
  Calendar,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import RoomStatusBadge from "@/components/admin/RoomStatusBadge";
import { adminApi, type DashboardStats, type RecentRoom, type RecentUser } from "@/lib/api/adminApi";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}tr`;
  if (price >= 1_000) return `${Math.round(price / 1_000)}k`;
  return price.toLocaleString("vi-VN");
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

function roleLabel(role: string) {
  return role === "admin" ? "Quản trị" : role === "owner" ? "Chủ trọ" : "Người dùng";
}

function roleBadge(role: string) {
  return role === "admin"
    ? "bg-red-100 text-red-600"
    : role === "owner"
    ? "bg-purple-100 text-purple-600"
    : "bg-blue-100 text-blue-600";
}

// ── Mini chart bars (fake sparkline using CSS) ────────────────────────────────
function MiniBar({ heights }: { heights: number[] }) {
  const max = Math.max(...heights) || 1;
  return (
    <div className="flex items-end gap-0.5 h-10">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-orange-400 rounded-sm opacity-80 transition-all duration-300"
          style={{ height: `${(h / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

// ── Dummy chart data (replace with real API later) ────────────────────────────
const WEEKLY_ROOMS = [4, 7, 5, 9, 12, 8, 15];
const WEEKLY_USERS = [2, 5, 3, 6, 8, 4, 11];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [statsData, roomsData, usersData] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getRecentRooms(5),
        adminApi.getRecentUsers(5),
      ]);
      setStats(statsData);
      setRecentRooms(roomsData);
      setRecentUsers(usersData);
    } catch {
      setError("Không thể tải dữ liệu. Hãy kiểm tra backend hoặc quyền admin.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-72 gap-4">
        <AlertCircle size={48} className="text-orange-400" />
        <p className="text-gray-600 text-sm max-w-sm text-center">{error}</p>
        <button
          onClick={() => loadData()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // ── Stat values ─────────────────────────────────────────────────────────────
  const statCards = [
    {
      label: "Tổng người dùng",
      value: stats?.total_users ?? 0,
      icon: Users,
      color: "blue" as const,
      change: stats ? Math.round((stats.new_users_today / Math.max(stats.total_users - stats.new_users_today, 1)) * 100) : undefined,
    },
    {
      label: "Tổng tin đăng",
      value: stats?.total_rooms ?? 0,
      icon: Home,
      color: "orange" as const,
      change: stats ? Math.round((stats.new_rooms_today / Math.max(stats.total_rooms - stats.new_rooms_today, 1)) * 100) : undefined,
    },
    {
      label: "Phòng đang hiển thị",
      value: stats?.total_active_rooms ?? 0,
      icon: CheckCircle,
      color: "green" as const,
    },
    {
      label: "Phòng chờ duyệt",
      value: stats?.total_pending_rooms ?? 0,
      icon: Clock,
      color: "red" as const,
    },
    {
      label: "Lượt xem hôm nay",
      value: stats?.total_views_today ?? 0,
      icon: Eye,
      color: "purple" as const,
    },
    {
      label: "Phòng đã cho thuê",
      value: stats?.total_rented_rooms ?? 0,
      icon: TrendingUp,
      color: "teal" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Tổng quan hoạt động của AIGuesthouse
          </p>
        </div>
        <button
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} loading={loading} />
        ))}
      </div>

      {/* ── Charts row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tin đăng 7 ngày */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                Tin đăng mới (7 ngày)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Tuần này</p>
            </div>
            <span className="text-2xl font-bold text-orange-500">
              {WEEKLY_ROOMS.reduce((a, b) => a + b, 0)}
            </span>
          </div>
          <MiniBar heights={WEEKLY_ROOMS} />
          <div className="flex justify-between mt-2">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
              <span key={d} className="text-[10px] text-gray-400 flex-1 text-center">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Người dùng 7 ngày */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                Người dùng mới (7 ngày)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Tuần này</p>
            </div>
            <span className="text-2xl font-bold text-blue-500">
              {WEEKLY_USERS.reduce((a, b) => a + b, 0)}
            </span>
          </div>
          <div className="flex items-end gap-0.5 h-10">
            {WEEKLY_USERS.map((h, i) => {
              const max = Math.max(...WEEKLY_USERS) || 1;
              return (
                <div
                  key={i}
                  className="flex-1 bg-blue-400 rounded-sm opacity-80"
                  style={{ height: `${(h / max) * 100}%` }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
              <span key={d} className="text-[10px] text-gray-400 flex-1 text-center">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Today highlights ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-md">
          <p className="text-sm opacity-90 font-medium">Người dùng mới hôm nay</p>
          <p className="text-4xl font-bold mt-2">
            {loading ? "—" : stats?.new_users_today ?? 0}
          </p>
          <p className="text-xs opacity-70 mt-2 flex items-center gap-1">
            <Calendar size={12} />
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "numeric",
              month: "numeric",
            })}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-md">
          <p className="text-sm opacity-90 font-medium">Tin mới hôm nay</p>
          <p className="text-4xl font-bold mt-2">
            {loading ? "—" : stats?.new_rooms_today ?? 0}
          </p>
          <p className="text-xs opacity-70 mt-2 flex items-center gap-1">
            <Home size={12} />
            Đang chờ duyệt: {loading ? "—" : stats?.total_pending_rooms ?? 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-md">
          <p className="text-sm opacity-90 font-medium">Lượt xem hôm nay</p>
          <p className="text-4xl font-bold mt-2">
            {loading ? "—" : (stats?.total_views_today ?? 0).toLocaleString("vi-VN")}
          </p>
          <p className="text-xs opacity-70 mt-2 flex items-center gap-1">
            <Eye size={12} />
            Tổng phòng đang hiển thị: {loading ? "—" : stats?.total_active_rooms ?? 0}
          </p>
        </div>
      </div>

      {/* ── Recent activity ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Rooms */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800 text-sm">
              Tin đăng mới nhất
            </h3>
            <Link
              href="/admin/rooms"
              className="text-xs text-orange-500 hover:text-orange-600 flex items-center gap-1 font-medium"
            >
              Xem tất cả <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-50 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Home size={32} className="opacity-40 mb-2" />
              <p className="text-sm">Chưa có tin đăng nào</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentRooms.map((room) => (
                <li
                  key={room.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/70 transition-colors"
                >
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Home size={16} className="text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {room.title}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin size={10} />
                      {room.address}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <RoomStatusBadge status={room.status} />
                    <span className="text-xs font-semibold text-orange-600">
                      {formatPrice(room.price)}/th
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800 text-sm">
              Người dùng mới nhất
            </h3>
            <Link
              href="/admin/users"
              className="text-xs text-orange-500 hover:text-orange-600 flex items-center gap-1 font-medium"
            >
              Xem tất cả <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-50 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Users size={32} className="opacity-40 mb-2" />
              <p className="text-sm">Chưa có người dùng nào</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentUsers.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/70 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {u.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge(u.role)}`}
                    >
                      {roleLabel(u.role)}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {timeAgo(u.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
