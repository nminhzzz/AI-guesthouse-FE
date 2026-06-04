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

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  avatar?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
  if (!/[A-Z]/.test(password)) return "Mật khẩu phải chứa ít nhất một chữ viết hoa";
  if (!/[a-z]/.test(password)) return "Mật khẩu phải chứa ít nhất một chữ viết thường";
  if (!/\d/.test(password)) return "Mật khẩu phải chứa ít nhất một chữ số";
  return null;
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
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
      setErrors({});
      setSubmitError("");
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({ ...prev, avatar: "Chỉ chấp nhận file JPEG, PNG hoặc WEBP" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: "Ảnh không được vượt quá 5MB" }));
      return;
    }

    setErrors((prev) => ({ ...prev, avatar: undefined }));
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};

    // name: bắt buộc, 1–100 ký tự
    if (!formData.name.trim()) {
      errs.name = "Họ và tên không được để trống";
    } else if (formData.name.trim().length > 100) {
      errs.name = "Họ và tên tối đa 100 ký tự";
    }

    // email: bắt buộc, đúng format
    if (!formData.email.trim()) {
      errs.email = "Email không được để trống";
    } else if (!validateEmail(formData.email.trim())) {
      errs.email = "Email không đúng định dạng";
    }

    // phone: tuỳ chọn, tối đa 20 ký tự, chỉ số và dấu +
    if (formData.phone && formData.phone.trim().length > 0) {
      if (formData.phone.trim().length > 20) {
        errs.phone = "Số điện thoại tối đa 20 ký tự";
      } else if (!/^[+\d\s\-()]+$/.test(formData.phone.trim())) {
        errs.phone = "Số điện thoại không hợp lệ";
      }
    }

    // password: bắt buộc khi tạo mới, tuỳ chọn khi edit
    if (!user) {
      if (!formData.password) {
        errs.password = "Mật khẩu không được để trống";
      } else {
        const pwErr = validatePassword(formData.password);
        if (pwErr) errs.password = pwErr;
      }
    } else if (formData.password) {
      const pwErr = validatePassword(formData.password);
      if (pwErr) errs.password = pwErr;
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      if (user) {
        if (avatarFile) {
          // Có avatar mới → dùng PUT (FormData)
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
          // Không có avatar → dùng PATCH (JSON)
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
        // Tạo mới
        const data = new FormData();
        data.append("name", formData.name.trim());
        data.append("email", formData.email.trim());
        if (formData.phone.trim()) data.append("phone", formData.phone.trim());
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
      setSubmitError(err.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const setField = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Xóa lỗi của field khi user bắt đầu sửa
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
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
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto flex-1">

          {/* Submit error */}
          {submitError && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {submitError}
            </div>
          )}

          {/* Avatar */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-20 h-20 rounded-full border-2 border-dashed overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer transition-colors ${
                errors.avatar ? "border-red-400" : "border-gray-300 hover:border-orange-400"
              }`}
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
            {errors.avatar && <p className="text-xs text-red-500">{errors.avatar}</p>}
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
            <label className="text-sm font-medium text-gray-700">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setField("name", e.target.value)}
              maxLength={100}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setField("email", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                errors.email ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setField("phone", e.target.value)}
              maxLength={20}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>

          {/* Vai trò */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Vai trò</label>
            <select
              value={formData.role}
              onChange={(e) => setField("role", e.target.value)}
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
                onChange={(e) => setField("is_active", e.target.value === "true")}
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
                onChange={(e) => setField("is_verified", e.target.value === "true")}
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
              {user ? "Mật khẩu mới" : "Mật khẩu"}
              {!user && <span className="text-red-500"> *</span>}
              {user && <span className="text-gray-400 font-normal"> (để trống nếu không đổi)</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setField("password", e.target.value)}
              placeholder={user ? "••••••••" : ""}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                errors.password ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.password ? (
              <p className="text-xs text-red-500">{errors.password}</p>
            ) : (
              <p className="text-xs text-gray-400">
                Ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số
              </p>
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
