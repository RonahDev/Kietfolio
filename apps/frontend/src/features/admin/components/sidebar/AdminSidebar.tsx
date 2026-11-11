import React from 'react'
import {
  LayoutDashboard,
  Film,
  Tv,
  Tags,
  Layers,
  Image,
  Users,
  ShieldCheck,
  BarChart3,
  DollarSign,
  FileSpreadsheet,
  History,
  Server,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Bot,
} from 'lucide-react'

export type AdminTab =
  | 'overview'
  | 'movies'
  | 'tv_series'
  | 'genres'
  | 'categories'
  | 'banners'
  | 'auto_sync'
  | 'users'
  | 'rbac'
  | 'analytics'
  | 'revenue'
  | 'reports'
  | 'audit_logs'
  | 'video_servers'
  | 'broken_links'
  | 'settings'
  | 'security'

interface AdminSidebarProps {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
  isCollapsed: boolean
  setIsCollapsed: (val: boolean) => void
  onLogout: () => void
  role?: string
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onLogout,
  role = 'super_admin',
}) => {
  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'overview' as AdminTab, label: 'Tổng Quan Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'CONTENT MANAGEMENT',
      items: [
        { id: 'movies' as AdminTab, label: 'Phim Điện Ảnh', icon: Film },
        { id: 'tv_series' as AdminTab, label: 'TV Series & Tập Phim', icon: Tv },
        { id: 'genres' as AdminTab, label: 'Thể Loại Phim', icon: Tags },
        { id: 'categories' as AdminTab, label: 'Danh Mục & Bộ Sưu Tập', icon: Layers },
        { id: 'banners' as AdminTab, label: 'Banner Trang Chủ', icon: Image },
        { id: 'auto_sync' as AdminTab, label: 'Tự Động Nạp Phim (Auto Sync)', icon: Bot },
      ],
    },
    {
      title: 'USER MANAGEMENT',
      items: [
        { id: 'users' as AdminTab, label: 'Người Dùng & VIP', icon: Users },
        { id: 'rbac' as AdminTab, label: 'Phân Quyền (RBAC)', icon: ShieldCheck },
      ],
    },
    {
      title: 'ANALYTICS & FINANCIALS',
      items: [
        { id: 'analytics' as AdminTab, label: 'Thống Kê Truy Cập', icon: BarChart3 },
        { id: 'revenue' as AdminTab, label: 'Phân Tích Doanh Thu', icon: DollarSign },
        { id: 'reports' as AdminTab, label: 'Báo Cáo & Export CSV', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'SYSTEM & MONITORING',
      items: [
        { id: 'video_servers' as AdminTab, label: 'Giám Sát Server Video', icon: Server },
        { id: 'broken_links' as AdminTab, label: 'Quét Link Hỏng', icon: AlertTriangle },
        { id: 'audit_logs' as AdminTab, label: 'Nhật Ký Kiểm Toán', icon: History },
        { id: 'settings' as AdminTab, label: 'Cấu Hình Hệ Thống', icon: Settings },
      ],
    },
    {
      title: 'ACCOUNT & SECURITY',
      items: [
        { id: 'security' as AdminTab, label: 'Bảo Mật & Phiên Đăng Nhập', icon: ShieldAlert },
      ],
    },
  ]

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#111114] border-r border-[#2b2b31] flex flex-col transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#2b2b31] bg-[#09090b]">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#fafafa] font-['Plus_Jakarta_Sans',sans-serif] tracking-wide">
                MOVIE HUB ADMIN
              </span>
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider font-semibold">
                {role.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] flex items-center justify-center text-white font-bold mx-auto">
            M
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-[#202024] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
          title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-mono font-bold tracking-widest text-[#71717a] uppercase">
                {sec.title}
              </span>
            )}
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#dc2626] text-white font-semibold shadow-[0_0_20px_rgba(220,38,38,0.35)]'
                        : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#a1a1aa]'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer & Logout */}
      <div className="p-3 border-t border-[#2b2b31] bg-[#09090b]">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold text-rose-400 hover:text-rose-200 hover:bg-rose-950/30 transition-colors cursor-pointer"
          title={isCollapsed ? 'Đăng xuất khỏi phiên quản trị' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Đăng Xuất Phiên</span>}
        </button>
      </div>
    </aside>
  )
}
