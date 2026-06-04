"use client";

import { useEffect, useState, useCallback } from "react";
import { User } from "@/types";
import { userApi } from "@/lib/api/userApi";
import { Plus, Users as UsersIcon } from "lucide-react";
import UserTable from "@/components/admin/users/UserTable";
import UserFilters from "@/components/admin/users/UserFilters";
import UserFormModal from "@/components/admin/users/UserFormModal";
import DeleteConfirmModal from "@/components/admin/users/DeleteConfirmModal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    is_active: "all",
  });

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const is_active_bool =
        filters.is_active === "true"
          ? true
          : filters.is_active === "false"
          ? false
          : undefined;

      const res = await userApi.getUsers({
        page,
        page_size: 10,
        search: filters.search || undefined,
        role: filters.role || undefined,
        is_active: is_active_bool,
        sort_by: "created_at",
        sort_order: "desc",
      });

      setUsers(res.items);
      setTotalPages(res.total_pages);
      setTotalItems(res.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters((prev) => {
      if (
        prev.search === newFilters.search &&
        prev.role === newFilters.role &&
        prev.is_active === newFilters.is_active
      ) {
        return prev;
      }
      setPage(1); // Reset to page 1 on filter change
      return newFilters;
    });
  }, []);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await userApi.patchUser(user.id, { is_active: !user.is_active });
      fetchUsers();
    } catch (error: any) {
      console.error("Failed to toggle status:", error);
      alert(error.message || "Không thể thay đổi trạng thái tài khoản. Vui lòng kiểm tra console.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UsersIcon className="text-orange-500" /> Quản lý Người dùng
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng cộng {totalItems} người dùng trên hệ thống
          </p>
        </div>

        <button
          onClick={handleCreateUser}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-orange-500/20"
        >
          <Plus size={18} /> Thêm người dùng
        </button>
      </div>

      {/* Filters */}
      <UserFilters onFilterChange={handleFilterChange} />

      {/* Table */}
      <UserTable
        users={users}
        loading={loading}
        onEdit={handleEditUser}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteUser}
      />

      {/* Pagination (Simple) */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <div className="text-sm font-medium text-gray-600">
            Trang {page} / {totalPages}
          </div>
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
      <UserFormModal
        user={selectedUser}
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSuccess={fetchUsers}
      />

      <DeleteConfirmModal
        user={selectedUser}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
