"use client";

import { Trash2, X } from "lucide-react";
import type { Room } from "@/types";

interface Props {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function RoomDeleteConfirmModal({ room, isOpen, onClose, onConfirm, loading }: Props) {
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">Xác nhận xóa phòng</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <p className="text-center text-sm text-gray-600 mb-1">Bạn chắc chắn muốn xóa phòng:</p>
          <p className="text-center text-sm font-semibold text-gray-800 mb-3 line-clamp-2">"{room.title}"</p>
          <p className="text-center text-xs text-gray-400">Phòng sẽ bị ẩn khỏi hệ thống (soft delete). Hành động này có thể khôi phục bằng cách liên hệ database.</p>
        </div>

        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Đang xóa..." : "Xóa phòng"}
          </button>
        </div>
      </div>
    </div>
  );
}
