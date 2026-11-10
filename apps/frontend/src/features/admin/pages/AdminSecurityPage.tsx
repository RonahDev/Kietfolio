import React, { useState, useEffect, useCallback } from 'react'
import {
  ShieldAlert,
  Laptop,
  Smartphone,
  Globe,
  Trash2,
  LogOut,
  KeyRound,
  ShieldCheck,
} from 'lucide-react'
import { adminService } from '../services/adminService'
import type { AdminSessionItem } from '../types/admin'

export const AdminSecurityPage: React.FC = () => {
  const [sessions, setSessions] = useState<AdminSessionItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRevokingAll, setIsRevokingAll] = useState<boolean>(false)

  const loadSessions = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getSessions()
      setSessions(data)
    } catch (err) {
      console.error('[AdminSecurityPage Error]:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  const handleRevokeOne = async (sessionId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy phiên đăng nhập này?')) return
    try {
      await adminService.revokeSession(sessionId)
      loadSessions()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi hủy phiên')
    }
  }

  const handleRevokeOthers = async () => {
    if (!window.confirm('Xác nhận đăng xuất khỏi tất cả các thiết bị khác?')) return
    setIsRevokingAll(true)
    try {
      await adminService.revokeOtherSessions()
      loadSessions()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi hủy các phiên khác')
    } finally {
      setIsRevokingAll(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2b2b31] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[#fafafa] flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#dc2626]" />
            Bảo Mật Tài Khoản & Quản Lý Phiên (Sessions)
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Kiểm soát các phiên làm việc quản trị đang hoạt động với cookie HttpOnly và cơ chế chống CSRF hai lớp.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRevokeOthers}
          disabled={isRevokingAll || sessions.length <= 1}
          className="px-4 py-2 rounded-md bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
        >
          <LogOut className="w-4 h-4" />
          Đăng Xuất Khỏi Tất Cả Thiết Bị Khác
        </button>
      </div>

      {/* Security Status Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111114] border border-[#2b2b31] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">HttpOnly Cookie</h4>
            <p className="text-[11px] text-[#71717a]">Chống đánh cắp token qua XSS</p>
          </div>
        </div>

        <div className="bg-[#111114] border border-[#2b2b31] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#202024] border border-[#2b2b31] flex items-center justify-center text-[#d4af37]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Double-Submit CSRF</h4>
            <p className="text-[11px] text-[#71717a]">Bảo vệ mọi mutation POST/PUT/DELETE</p>
          </div>
        </div>

        <div className="bg-[#111114] border border-[#2b2b31] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#202024] border border-[#2b2b31] flex items-center justify-center text-sky-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Idle Timeout (60 Phút)</h4>
            <p className="text-[11px] text-[#71717a]">Tự động khóa phiên khi không thao tác</p>
          </div>
        </div>
      </div>

      {/* Active Sessions List */}
      <div className="bg-[#111114] border border-[#2b2b31] rounded-xl overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-[#2b2b31] bg-[#18181b]">
          <h3 className="text-sm font-bold text-white">Các Thiết Bị Đang Đăng Nhập ({sessions.length})</h3>
        </div>

        <div className="divide-y divide-[#202024]">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-[#71717a]">Đang tải danh sách phiên...</div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#71717a]">Không có phiên hoạt động nào.</div>
          ) : (
            sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#18181b]/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#202024] border border-[#2b2b31] flex items-center justify-center text-white shrink-0">
                    {sess.device?.toLowerCase().includes('mobile') ? (
                      <Smartphone className="w-5 h-5 text-[#a1a1aa]" />
                    ) : (
                      <Laptop className="w-5 h-5 text-[#a1a1aa]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">
                        {sess.browser || 'Web Browser'} ({sess.os || 'Windows'})
                      </h4>
                      {sess.isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                          Phiên hiện tại
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-[#a1a1aa] mt-1">IP: {sess.ipAddress}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-[#71717a]">
                      <span>Đăng nhập lúc: {new Date(sess.createdAt).toLocaleString('vi-VN')}</span>
                      <span>•</span>
                      <span>Hoạt động cuối: {new Date(sess.lastActiveAt || sess.lastActivityAt).toLocaleTimeString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                {!sess.isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleRevokeOne(sess.id)}
                    className="px-3 py-1.5 rounded-md bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Thu Hồi Phiên
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
