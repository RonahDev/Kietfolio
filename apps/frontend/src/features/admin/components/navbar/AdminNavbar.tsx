import React, { useState } from 'react'
import {
  Bell,
  Search,
  ExternalLink,
  Film,
  ChevronRight,
  User,
} from 'lucide-react'
import type { AdminTab } from '../sidebar/AdminSidebar'

interface AdminNavbarProps {
  activeTab: AdminTab
  adminUser?: {
    displayName?: string
    email: string
    photoUrl?: string
    role: string
  } | null
  onBackToCinema: () => void
}

const TAB_TITLES: Record<AdminTab, { title: string; category: string }> = {
  overview: { title: 'Tổng Quan Dashboard', category: 'Overview' },
  movies: { title: 'Quản Lý Phim Điện Ảnh', category: 'Content' },
  tv_series: { title: 'TV Series & Tập Phim', category: 'Content' },
  genres: { title: 'Quản Lý Thể Loại', category: 'Content' },
  categories: { title: 'Danh Mục & Bộ Sưu Tập', category: 'Content' },
  banners: { title: 'Quản Lý Banners Trang Chủ', category: 'Content' },
  auto_sync: { title: 'Tự Động Hóa Lấy Phim (Auto Sync)', category: 'Content' },
  users: { title: 'Người Dùng & Hội Viên VIP', category: 'Users' },
  rbac: { title: 'Ma Trận Phân Quyền (RBAC)', category: 'Users' },
  analytics: { title: 'Thống Kê Lưu Lượng Truy Cập', category: 'Analytics' },
  revenue: { title: 'Phân Tích Doanh Thu Thực Tế', category: 'Analytics' },
  reports: { title: 'Báo Cáo & Xuất Dữ Liệu', category: 'Analytics' },
  video_servers: { title: 'Giám Sát Cụm Server Video', category: 'System' },
  broken_links: { title: 'Bộ Quét & Sửa Link Hỏng', category: 'System' },
  audit_logs: { title: 'Nhật Ký Kiểm Toán (Audit Logs)', category: 'System' },
  settings: { title: 'Cấu Hình Hệ Thống', category: 'System' },
  security: { title: 'Bảo Mật & Quản Lý Phiên', category: 'Account' },
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  activeTab,
  adminUser,
  onBackToCinema,
}) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const currentTabInfo = TAB_TITLES[activeTab] || { title: 'Dashboard', category: 'Admin' }

  return (
    <header className="h-16 bg-[#111114]/90 backdrop-blur-md border-b border-[#2b2b31] flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">Admin</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#71717a]" />
        <span className="text-[#a1a1aa]">{currentTabInfo.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#71717a]" />
        <span className="text-white font-bold tracking-wide">{currentTabInfo.title}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18181b] border border-[#2b2b31] text-xs text-[#a1a1aa]">
          <Search className="w-3.5 h-3.5 text-[#71717a]" />
          <input
            type="text"
            placeholder="Tìm phim, đạo diễn, user..."
            className="bg-transparent text-white outline-none placeholder-[#71717a] w-44 font-mono text-[11px]"
          />
        </div>

        {/* Back to Cinema Stream Shortcut */}
        <button
          type="button"
          onClick={onBackToCinema}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181b] hover:bg-[#202024] border border-[#2b2b31] text-xs font-mono font-bold text-[#d4af37] transition-all cursor-pointer shadow-xs"
          title="Quay lại giao diện xem phim Cinema Stream"
        >
          <Film className="w-3.5 h-3.5 text-[#dc2626]" />
          <span>VÀO RẠP 4K</span>
          <ExternalLink className="w-3 h-3 text-[#71717a]" />
        </button>

        {/* System Notifications Badge */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-[#18181b] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
            title="Thông báo hệ thống"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-md bg-[#18181b] border border-[#2b2b31] shadow-2xl p-4 space-y-3 z-50 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-[#2b2b31] pb-2 font-bold text-[#fafafa]">
                <span>THÔNG BÁO HỆ THỐNG</span>
                <span className="text-[10px] text-[#dc2626] bg-[#dc2626]/20 px-1.5 py-0.5 rounded-xs">
                  3 MỚI
                </span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded-sm bg-[#202024] border-l-2 border-emerald-500">
                  <p className="font-bold text-white">Đối soát GD VNPay Thành Công</p>
                  <p className="text-[#a1a1aa]">Giao dịch #VNP_88291 nhận 50,000đ.</p>
                </div>
                <div className="p-2 rounded-sm bg-[#202024] border-l-2 border-amber-500">
                  <p className="font-bold text-white">Phát hiện Link Hỏng</p>
                  <p className="text-[#a1a1aa]">1 phim đang thiếu đường dẫn video m3u8.</p>
                </div>
                <div className="p-2 rounded-sm bg-[#202024] border-l-2 border-blue-500">
                  <p className="font-bold text-white">Đăng ký người dùng mới</p>
                  <p className="text-[#a1a1aa]">15 thành viên mới trong 24 giờ qua.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Identity Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#2b2b31]">
          {adminUser?.photoUrl ? (
            <img
              src={adminUser.photoUrl}
              alt="Admin Avatar"
              className="w-8 h-8 rounded-full border border-[#d4af37]/60 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#202024] border border-[#d4af37]/60 flex items-center justify-center text-[#d4af37]">
              <User className="w-4 h-4" />
            </div>
          )}
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-[#fafafa] leading-tight">
              {adminUser?.displayName || 'Mai Anh Kiệt'}
            </span>
            <span className="text-[10px] font-mono text-[#d4af37] font-semibold">
              {adminUser?.role?.toUpperCase() || 'SUPER ADMIN'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
