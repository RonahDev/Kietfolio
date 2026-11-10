import React, { useState, useEffect, useCallback } from 'react'
import {
  History,
  X,
  Code,
} from 'lucide-react'
import { adminService } from '../services/adminService'

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedLog, setSelectedLog] = useState<any | null>(null)

  const loadLogs = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getAuditLogs({
        page,
        limit: 15,
        action: actionFilter !== 'all' ? actionFilter : undefined,
      })
      setLogs(data.logs)
      setTotalCount(data.total)
    } catch (err) {
      console.error('[AdminAuditLogsPage Error]:', err)
    } finally {
      setIsLoading(false)
    }
  }, [page, actionFilter])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  const getActionBadge = (action: string) => {
    if (action.includes('CREATE')) {
      return 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
    }
    if (action.includes('DELETE')) {
      return 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
    }
    if (action.includes('UPDATE')) {
      return 'bg-sky-950/80 text-sky-400 border border-sky-500/40'
    }
    if (action.includes('LOGIN')) {
      return 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
    }
    return 'bg-zinc-800 text-zinc-300 border border-zinc-700'
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2b2b31] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[#fafafa] flex items-center gap-2.5">
            <History className="w-5 h-5 text-[#dc2626]" />
            Nhật Ký Kiểm Toán (Immutable Audit Logs)
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Ghi nhận bất biến toàn bộ hành vi quản trị, cập nhật phim, phân quyền và các yêu cầu đăng nhập hệ thống.
          </p>
        </div>

        <div className="text-xs font-mono text-[#d4af37] bg-[#18181b] border border-[#2b2b31] px-3.5 py-2 rounded-lg">
          Tổng cộng {totalCount} sự kiện kiểm toán
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value)
            setPage(1)
          }}
          className="px-3 py-2 bg-[#111114] border border-[#2b2b31] rounded-lg text-xs text-white focus:border-[#dc2626] focus:outline-none"
        >
          <option value="all">Tất cả hành động</option>
          <option value="ADMIN_LOGIN">Đăng nhập Admin</option>
          <option value="MOVIE_CREATE">Tạo mới Phim</option>
          <option value="MOVIE_UPDATE">Cập nhật Phim</option>
          <option value="MOVIE_DELETE">Xóa Phim</option>
          <option value="USER_ROLE_UPDATE">Thay đổi phân quyền</option>
          <option value="USER_SUSPEND">Khóa tài khoản</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-[#111114] border border-[#2b2b31] rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#fafafa]">
            <thead className="bg-[#18181b] border-b border-[#2b2b31] text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Thời Gian</th>
                <th className="py-3 px-4">Người Thực Hiện</th>
                <th className="py-3 px-4">Hành Động</th>
                <th className="py-3 px-4">Đối Tượng (Resource)</th>
                <th className="py-3 px-4">Địa Chỉ IP</th>
                <th className="py-3 px-4 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202024]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#71717a]">
                    Đang tải nhật ký kiểm toán...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#71717a]">
                    Chưa có sự kiện kiểm toán nào phù hợp.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#18181b]/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#a1a1aa] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {log.actor?.email || log.actorId || 'Hệ Thống'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#d4af37]">
                      {log.resource} {log.resourceId ? `(${log.resourceId.slice(0, 8)})` : ''}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#71717a]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 rounded bg-[#202024] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-all cursor-pointer font-mono text-[10px]"
                      >
                        Xem JSON
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111114] border border-[#2b2b31] rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2b2b31] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-[#dc2626]" />
                Chi Tiết Sự Kiện Kiểm Toán — {selectedLog.action}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-[#71717a] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-[#71717a] block">ID SỰ KIỆN:</span>
                  <span className="text-white">{selectedLog.id}</span>
                </div>
                <div>
                  <span className="text-[#71717a] block">THỜI GIAN:</span>
                  <span className="text-white">{new Date(selectedLog.createdAt).toISOString()}</span>
                </div>
                <div>
                  <span className="text-[#71717a] block">IP ADDRESS:</span>
                  <span className="text-white">{selectedLog.ipAddress || '127.0.0.1'}</span>
                </div>
                <div>
                  <span className="text-[#71717a] block">USER AGENT:</span>
                  <span className="text-white truncate block">{selectedLog.userAgent || 'Mozilla / Browser'}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#71717a] block mb-1">DỮ LIỆU THAY ĐỔI (PAYLOAD):</span>
                <pre className="p-3 bg-[#09090b] border border-[#2b2b31] rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60">
                  {JSON.stringify(selectedLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-[#2b2b31] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 rounded-md bg-[#202024] hover:bg-[#27272a] text-xs font-semibold text-white"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
