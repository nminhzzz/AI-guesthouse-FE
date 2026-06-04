"use client";

import Image from "next/image";
import { MoreVertical, Eye, CheckCircle, XCircle, EyeOff, RotateCcw, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Room } from "@/types";
import RoomStatusBadge from "@/components/admin/RoomStatusBadge";

const ROOM_TYPE_LABEL: Record<string, string> = {
  room: "Phòng trọ",
  apartment: "Chung cư mini",
  dormitory: "Ký túc xá",
  house: "Nhà nguyên căn",
};

interface Props {
  rooms: Room[];
  loading: boolean;
  onView: (room: Room) => void;
  onApprove: (room: Room) => void;
  onReject: (room: Room) => void;
  onHide: (room: Room) => void;
  onRestore: (room: Room) => void;
  onDelete: (room: Room) => void;
}

function ActionMenu({ room, onView, onApprove, onReject, onHide, onRestore, onDelete }: {
  room: Room;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  onHide: () => void;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const btn = (icon: React.ReactNode, label: string, action: () => void, className = "") => (
    <button
      onClick={() => { action(); setOpen(false); }}
      className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors ${className}`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 w-44">
          {btn(<Eye size={14} />, "Xem chi tiết", onView, "text-gray-700")}
          {room.status === "pending" && btn(<CheckCircle size={14} />, "Duyệt phòng", onApprove, "text-green-600")}
          {room.status === "pending" && btn(<XCircle size={14} />, "Từ chối", onReject, "text-red-500")}
          {room.status === "active" && btn(<EyeOff size={14} />, "Ẩn phòng", onHide, "text-orange-500")}
          {(room.status === "hidden") && btn(<RotateCcw size={14} />, "Khôi phục", onRestore, "text-blue-500")}
          {room.status !== "deleted" && (
            <div className="border-t border-gray-100 mt-1 pt-1">
              {btn(<Trash2 size={14} />, "Xóa phòng", onDelete, "text-red-500")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RoomTable({ rooms, loading, onView, onApprove, onReject, onHide, onRestore, onDelete }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 animate-pulse">
            <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
            <div className="w-20 h-6 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="text-4xl mb-3">🏠</div>
        <p className="text-sm font-medium">Không tìm thấy phòng nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        <span>Phòng</span>
        <span>Loại / Giá</span>
        <span>Địa chỉ</span>
        <span>Trạng thái</span>
        <span />
      </div>

      {rooms.map((room, idx) => {
        const roomId = room.id || (room as any)._id;
        const thumbnail = room.images?.[room.thumbnail_index ?? 0]?.url;
        return (
          <div
            key={roomId || idx}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
          >
            {/* Phòng */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {thumbnail ? (
                  <Image src={thumbnail} alt={room.title} width={56} height={56} className="object-cover w-full h-full" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">🏠</div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{room.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  👁 {room.views} · ♥ {room.favorite_count}
                </p>
              </div>
            </div>

            {/* Loại / Giá */}
            <div>
              <p className="text-xs text-gray-500">{ROOM_TYPE_LABEL[room.room_type] ?? room.room_type}</p>
              <p className="text-sm font-semibold text-orange-500">
                {room.price.toLocaleString("vi-VN")}đ
              </p>
            </div>

            {/* Địa chỉ */}
            <div>
              <p className="text-xs text-gray-600 truncate">{room.district}</p>
              <p className="text-xs text-gray-400 truncate">{room.city}</p>
            </div>

            {/* Trạng thái */}
            <div>
              <RoomStatusBadge status={room.status} />
            </div>

            {/* Actions */}
            <ActionMenu
              room={room}
              onView={() => onView(room)}
              onApprove={() => onApprove(room)}
              onReject={() => onReject(room)}
              onHide={() => onHide(room)}
              onRestore={() => onRestore(room)}
              onDelete={() => onDelete(room)}
            />
          </div>
        );
      })}
    </div>
  );
}
