"use client";

import { useEffect, useState, useCallback } from "react";
import { Home, CheckCircle, Clock, EyeOff } from "lucide-react";
import type { Room } from "@/types";
import { adminRoomApi } from "@/lib/api/adminRoomApi";
import RoomFilters, { RoomFilterValues } from "@/components/admin/rooms/RoomFilters";
import RoomTable from "@/components/admin/rooms/RoomTable";
import RoomDetailModal from "@/components/admin/rooms/RoomDetailModal";
import RoomDeleteConfirmModal from "@/components/admin/rooms/RoomDeleteConfirmModal";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<RoomFilterValues>({
    search: "", status: "", room_type: "", city: "",
  });

  // Stats
  const [stats, setStats] = useState({ pending: 0, active: 0, hidden: 0 });

  // Modals
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);
  const [deleteRoom, setDeleteRoom] = useState<Room | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminRoomApi.listRooms({
        page,
        limit: 10,
        status: filters.status || undefined,
        room_type: filters.room_type || undefined,
        city: filters.city || undefined,
        search: filters.search || undefined,
      } as Parameters<typeof adminRoomApi.listRooms>[0]);
      setRooms(res.items);
      setTotal(res.total);
      setTotalPages(Math.ceil(res.total / 10));
    } catch (e: any) {
      showToast(e.message || "Lỗi tải danh sách phòng", "error");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  // Fetch stats (pending, active, hidden count)
  const fetchStats = useCallback(async () => {
    try {
      const [pendingRes, activeRes, hiddenRes] = await Promise.all([
        adminRoomApi.listRooms({ status: "pending", limit: 1 }),
        adminRoomApi.listRooms({ status: "active", limit: 1 }),
        adminRoomApi.listRooms({ status: "hidden", limit: 1 }),
      ]);
      setStats({
        pending: pendingRes.total,
        active: activeRes.total,
        hidden: hiddenRes.total,
      });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleFilterChange = useCallback((f: RoomFilterValues) => {
    setPage(1);
    setFilters(f);
  }, []);

  // --- Actions ---
  const doAction = async (label: string, fn: () => Promise<unknown>) => {
    setActionLoading(true);
    try {
      await fn();
      showToast(`${label} thành công`);
      fetchRooms();
      fetchStats();
    } catch (e: any) {
      showToast(e.message || `${label} thất bại`, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const getRoomId = (room: Room) => room.id || (room as any)._id;

  const handleApprove = (room: Room) => doAction("Duyệt phòng", () => adminRoomApi.approveRoom(getRoomId(room)));
  const handleReject = (room: Room) => doAction("Từ chối phòng", () => adminRoomApi.rejectRoom(getRoomId(room)));
  const handleHide = (room: Room) => doAction("Ẩn phòng", () => adminRoomApi.hideRoom(getRoomId(room)));
  const handleRestore = (room: Room) => doAction("Khôi phục phòng", () => adminRoomApi.restoreRoom(getRoomId(room)));
  const handleDeleteConfirm = async () => {
    if (!deleteRoom) return;
    await doAction("Xóa phòng", () => adminRoomApi.deleteRoom(getRoomId(deleteRoom)));
    setDeleteRoom(null);
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[999] px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Home className="text-orange-500" /> Quản lý Phòng trọ
          </h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng {total} phòng</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatChip
          icon={<Clock size={16} />}
          label="Chờ duyệt"
          value={stats.pending}
          color="yellow"
          onClick={() => handleFilterChange({ ...filters, status: "pending" })}
        />
        <StatChip
          icon={<CheckCircle size={16} />}
          label="Đang hiển thị"
          value={stats.active}
          color="green"
          onClick={() => handleFilterChange({ ...filters, status: "active" })}
        />
        <StatChip
          icon={<EyeOff size={16} />}
          label="Đã ẩn"
          value={stats.hidden}
          color="gray"
          onClick={() => handleFilterChange({ ...filters, status: "hidden" })}
        />
      </div>

      {/* Filters */}
      <RoomFilters onFilterChange={handleFilterChange} />

      {/* Table */}
      <RoomTable
        rooms={rooms}
        loading={loading}
        onView={setDetailRoom}
        onApprove={handleApprove}
        onReject={handleReject}
        onHide={handleHide}
        onRestore={handleRestore}
        onDelete={setDeleteRoom}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <span className="text-sm font-medium text-gray-600">Trang {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tiếp
          </button>
        </div>
      )}

      {/* Modals */}
      <RoomDetailModal
        room={detailRoom}
        isOpen={!!detailRoom}
        onClose={() => setDetailRoom(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onHide={handleHide}
        onRestore={handleRestore}
        onDelete={(room) => { setDetailRoom(null); setDeleteRoom(room); }}
      />

      <RoomDeleteConfirmModal
        room={deleteRoom}
        isOpen={!!deleteRoom}
        onClose={() => setDeleteRoom(null)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  );
}

function StatChip({
  icon, label, value, color, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "yellow" | "green" | "gray";
  onClick: () => void;
}) {
  const colors = {
    yellow: "bg-yellow-50 border-yellow-100 text-yellow-600",
    green: "bg-green-50 border-green-100 text-green-600",
    gray: "bg-gray-50 border-gray-200 text-gray-500",
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer hover:shadow-sm transition-all text-left ${colors[color]}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs font-medium opacity-80">{label}</p>
      </div>
    </button>
  );
}
