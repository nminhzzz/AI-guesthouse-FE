"use client";

import { User } from "@/types";
import { X, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { userApi } from "@/lib/api/userApi";
import Image from "next/image";

interface UserFormModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserFormModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: UserFormModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "user",
    is_verified: user?.is_verified ?? false,
    is_active: user?.is_active ?? true,
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync lại form mỗi khi mở modal với user mới
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role: user?.role || "user",
        is_verified: user?.is_verified ?? false,
        is_active: user?.is_active ?? true,
        password: "",
      });
      setAvatarFile(null);
      setAvatarPreview(user?.avatar_url || null);
      setError("");
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (user) {
        // Khi edit: nếu có avatar → dùng PUT (FormData), không có → dùng PATCH (JSON)
        if (avatarFile) {
          const data = new FormData();
          if (formData.name !== user.name) data.append("name", formData.name);
          if (formData.email !== user.email) data.append("email", formData.email);
          if (formData.phone !== (user.phone ?? "")) data.append("phone", formData.phone);
          if (formData.role !== user.role) data.append("role", formData.role);
          if (formData.password) data.append("password", formData.password);
          if (formData.is_verified !== user.is_verified)
            data.append("is_verified", String(formData.is_verified));
          if (formData.is_active !== user.is_active)
            data.append("is_active", String(formData.is_active));
          data.append("avatar", avatarFile);
          await userApi.updateUser(user.id, data);
        } else {
          const changes: Record<string, unknown> = {};
          if (formData.name !== user.name) changes.name = formData.name;
          if (formData.email !== user.email) changes.email = formData.email;
          if (formData.phone !== (user.phone ?? "")) changes.phone = formData.phone;
          if (formData.role !== user.role) changes.role = formData.role;
          if (formData.is_verified !== user.is_verified) changes.is_verified = formData.is_verified;
          if (formData.is_active !== user.is_active) changes.is_active = formData.is_active;
          if (formData.password) changes.password = formData.password;

          if (Object.keys(changes).length === 0) {
            onClose();
            return;
          }
          await userApi.patchUser(user.id, changes as Parameters<typeof userApi.patchUser>[1]);
        }
      } else {
        // Khi tạo mới: gửi FormData
        if (!formData.password) throw new Error("Vui lòng nhập mật khẩu cho người dùng mới");
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("role", formData.role);
        data.append("password", formData.password);
        data.append("is_verified", String(formData.is_verified));
        data.append("is_active", String(formData.is_active));
        if (avatarFile) data.append("avatar", avatarFile);
        await userApi.createUser(data);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">
            {user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer hover:border-orange-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <Upload size={24} className="text-gray-400" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-orange-500 hover:underline"
            >
              {avatarPreview ? "Đổi ảnh đại diện" : "Tải ảnh lên"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Họ và tên */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Vai trò */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Vai trò</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as "user" | "owner" | "admin" })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="user">Người dùng thường</option>
              <option value="owner">Chủ trọ</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          {/* Trạng thái & Xác thực */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <select
                value={String(formData.is_active)}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "true" })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="true">Hoạt động</option>
                <option value="false">Bị khóa</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Xác thực email</label>
              <select
                value={String(formData.is_verified)}
                onChange={(e) => setFormData({ ...formData, is_verified: e.target.value === "true" })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="true">Đã xác thực</option>
                <option value="false">Chưa xác thực</option>
              </select>
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              {user ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
            </label>
            <input
              type="password"
              required={!user}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={user ? "••••••••" : ""}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            {user && (
              <p className="text-xs text-gray-400">Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số</p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="user-form"
            disabled={loading}
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
