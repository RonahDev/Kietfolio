import React, { useState, useEffect, useCallback } from 'react'
import {
  Search,
  UserCheck,
  UserX,
} from 'lucide-react'
import { adminService } from '../services/adminService'
import type { AdminUserItem } from '../types/admin'

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getUsers({
        page,
        limit: 15,
        search,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      })
      setUsers(data.users)
      setTotalCount(data.pagination.total)
    } catch (err) {
      console.error('[AdminUsersPage Error]:', err)
    } finally {
      setIsLoading(false)
    }
  }, [page, search, roleFilter, statusFilter])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleToggleVip = async (user: AdminUserItem) => {
    const nextRole = user.role === 'vip' ? 'user' : 'vip'
    try {
      await adminService.updateUserRole(user.id, nextRole)
      loadUsers()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi cập nhật vai trò')
    }
  }

  const handleToggleStatus = async (user: AdminUserItem) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active'
    if (
      nextStatus === 'suspended' &&
      !confirm(`Bạn có chắc muốn đình chỉ tài khoản "${user.email}" không?`)
    ) {
      return
    }

    try {
      await adminService.updateUserStatus(user.id, nextStatus)
      loadUsers()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi cập nhật trạng thái')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-white">
            Quản Lý Người Dùng & Hội Viên VIP
          </h3>
          <p className="text-xs font-mono text-[#a1a1aa]">
            Kiểm soát danh sách tài khoản, phân quyền quản trị, kích hoạt gói VIP và quản lý phiên
          </p>
        </div>
        <div className="text-xs font-mono text-[#d4af37] bg-[#18181b] border border-[#2b2b31] px-3.5 py-1.5 rounded-lg shrink-0">
          Tổng cộng {totalCount} người dùng
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-lg bg-[#18181b] border border-[#2b2b31] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#111114] border border-[#2b2b31] text-white w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#71717a]" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Tìm theo email, tên..."
              className="bg-transparent outline-none text-xs text-white placeholder-[#71717a] w-full"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-1.5 rounded-md bg-[#111114] border border-[#2b2b31] text-[#fafafa] outline-none cursor-pointer"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="vip">Hội viên VIP 4K</option>
            <option value="user">Người dùng (Member)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-1.5 rounded-md bg-[#111114] border border-[#2b2b31] text-[#fafafa] outline-none cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang Hoạt Động</option>
            <option value="suspended">Đã Tạm Khóa</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg bg-[#18181b] border border-[#2b2b31] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#111114] text-[#71717a] uppercase text-[10px] border-b border-[#2b2b31]">
              <tr>
                <th className="py-3 px-3">Tài Khoản</th>
                <th className="py-3 px-3">Vai Trò</th>
                <th className="py-3 px-3">Trạng Thái</th>
                <th className="py-3 px-3">Nguồn</th>
                <th className="py-3 px-3">Ngày Tạo</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202024] text-[#fafafa]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#71717a]">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#71717a]">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#202024]/60 transition-colors">
                    <td className="py-3 px-3 flex items-center gap-2.5">
                      {u.photoUrl ? (
                        <img
                          src={u.photoUrl}
                          alt={u.displayName || 'Avatar'}
                          className="w-7 h-7 rounded-full object-cover border border-[#2b2b31]"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#202024] flex items-center justify-center text-[10px] text-white">
                          {u.displayName?.[0] || u.email[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                          {u.displayName || 'Chưa đặt tên'}
                        </div>
                        <div className="text-[11px] text-[#a1a1aa]">{u.email}</div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      {u.role === 'super_admin' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                          SUPER ADMIN
                        </span>
                      ) : u.role === 'admin' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                          ADMIN
                        </span>
                      ) : u.role === 'vip' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#d4af37]/20 text-[#d4af37] font-bold border border-[#d4af37]/40">
                          VIP 4K
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-500/20 text-slate-400 font-bold">
                          MEMBER
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {u.status === 'active' ? 'HOẠT ĐỘNG' : 'TẠM KHÓA'}
                      </span>
                    </td>

                    <td className="py-3 px-3 uppercase text-[10px] text-[#a1a1aa]">{u.provider}</td>

                    <td className="py-3 px-3 text-[#71717a]">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.role !== 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => handleToggleVip(u)}
                            className={`px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                              u.role === 'vip'
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                : 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37]/30'
                            }`}
                          >
                            {u.role === 'vip' ? 'Hạ Member' : '⭐ Lên VIP'}
                          </button>
                        )}

                        {u.role !== 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1.5 rounded transition-colors cursor-pointer ${
                              u.status === 'active'
                                ? 'hover:bg-rose-950/40 text-[#a1a1aa] hover:text-rose-400'
                                : 'hover:bg-emerald-950/40 text-emerald-400'
                            }`}
                            title={u.status === 'active' ? 'Khóa tài khoản' : 'Kích hoạt lại'}
                          >
                            {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
