"use client";

import { User } from "@/types";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";
import { userApi } from "@/lib/api/userApi";

interface DeleteConfirmModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteConfirmModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: DeleteConfirmModalProps) {
  const [hardDelete, setHardDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await userApi.deleteUser(user.id, hardDelete);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Không thể xóa người dùng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3 text-red-600">
            <div className="p-2 bg-red-50 rounded-full">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-xl font-bold">Xác nhận xóa</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <p className="text-gray-600 mb-2">
          Bạn có chắc chắn muốn xóa người dùng <strong className="text-gray-900">{user.name}</strong> ({user.email})?
        </p>

        <label className="flex items-start gap-3 p-3 mt-4 border border-red-100 bg-red-50/50 rounded-lg cursor-pointer hover:bg-red-50 transition-colors">
          <input
            type="checkbox"
            checked={hardDelete}
            onChange={(e) => setHardDelete(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-red-600 rounded border-red-300 focus:ring-red-500"
          />
          <div>
            <span className="block text-sm font-semibold text-red-800">Xóa vĩnh viễn (Hard Delete)</span>
            <span className="block text-xs text-red-600/80 mt-0.5">Xóa hoàn toàn khỏi cơ sở dữ liệu. Nếu không chọn, tài khoản sẽ chỉ bị vô hiệu hóa (xóa mềm).</span>
          </div>
        </label>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            {loading ? "Đang xóa..." : "Xác nhận xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}
