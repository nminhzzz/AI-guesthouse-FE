"use client";

import { User } from "@/types";
import { MoreVertical, Edit, Ban, CheckCircle, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface UserActionMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserActionMenu({
  user,
  onEdit,
  onToggleStatus,
  onDelete,
}: UserActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-10">
          <button
            onClick={() => {
              setIsOpen(false);
              onEdit(user);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Edit size={14} className="text-blue-500" />
            Chỉnh sửa
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onToggleStatus(user);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            {user.is_active ? (
              <>
                <Ban size={14} className="text-amber-500" />
                Khóa tài khoản
              </>
            ) : (
              <>
                <CheckCircle size={14} className="text-emerald-500" />
                Mở khóa tài khoản
              </>
            )}
          </button>

          <div className="h-px bg-gray-100 my-1.5"></div>

          <button
            onClick={() => {
              setIsOpen(false);
              onDelete(user);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
          >
            <Trash2 size={14} />
            Xóa vĩnh viễn
          </button>
        </div>
      )}
    </div>
  );
}
