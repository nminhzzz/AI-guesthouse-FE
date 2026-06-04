"use client";

import { User } from "@/types";
import Image from "next/image";
import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import UserActionMenu from "./UserActionMenu";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({
  users,
  loading,
  onEdit,
  onToggleStatus,
  onDelete,
}: UserTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="animate-pulse flex flex-col">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 border-b border-gray-50 bg-gray-50/50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center justify-center ">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          Không tìm thấy người dùng
        </h3>
        <p className="text-gray-500 mt-1">
          Không có người dùng nào khớp với bộ lọc hiện tại.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto pb-50">
      <table className="w-full text-left border-collapse pb-50">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-4 whitespace-nowrap">Người dùng</th>
            <th className="px-6 py-4 whitespace-nowrap">Vai trò</th>
            <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
            <th className="px-6 py-4 whitespace-nowrap">Ngày tham gia</th>
            <th className="px-6 py-4 whitespace-nowrap text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  {user.avatar_url &&
                  (user.avatar_url.startsWith("http") ||
                    user.avatar_url.startsWith("/")) ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover shadow-sm ring-2 ring-white"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shadow-sm ring-2 ring-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <UserRoleBadge role={user.role} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <UserStatusBadge isActive={user.is_active} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {format(new Date(user.created_at), "dd/MM/yyyy", {
                  locale: vi,
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end">
                  <UserActionMenu
                    user={user}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
