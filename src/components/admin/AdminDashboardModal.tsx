import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { ADMIN_EMAIL, type ContactMessage } from '../../types/auth'
import {
  X,
  Shield,
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Send,
  Sparkles,
} from 'lucide-react'

const MESSAGES_STORAGE_KEY = 'kietfolio_inbox_messages'

const defaultSeedMessages: ContactMessage[] = [
  {
    id: 'msg-seed-1',
    name: 'Tech Talent Acquisition (FPT Software)',
    email: 'hr.talent@fpt-software.com',
    subject: 'Trao đổi cơ hội Software Engineer & Logistics Solution',
    message:
      'Chào Kiệt, chúng tôi rất ấn tượng với profile kết hợp giữa Software Engineering tại ĐH FPT và 2 năm kinh nghiệm thực chiến điều phối ~50 tài xế tại Hub 63BDG02. Chúng tôi muốn mời bạn trao đổi về dự án giải pháp phần mềm sắp tới.',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    isVerifiedUser: true,
    read: false,
  },
  {
    id: 'msg-seed-2',
    name: 'Logistics Automation Lab',
    email: 'research.lead@automation-lab.io',
    subject: 'Chia sẻ kinh nghiệm xử lý điểm nghẽn ngày Mega Sale',
    message:
      'Chào bạn! Đọc case study về trực giác vận hành và xử lý nghẽn băng chuyền ngày sale của bạn rất thực tế. Rất mong có dịp kết nối và chia sẻ thêm về hệ thống.',
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
    isVerifiedUser: false,
    read: true,
  },
]

export const AdminDashboardModal: React.FC = () => {
  const { user, isAdmin, isAdminModalOpen, closeAdminModal, signOutUser } = useAuth()
  const { language } = useLanguage()
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const stored = localStorage.getItem(MESSAGES_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // fallback
    }
    return defaultSeedMessages
  })
  const [activeTab, setActiveTab] = useState<'inbox' | 'telemetry'>('inbox')

  if (!isAdminModalOpen || !isAdmin) return null

  const markAsRead = (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m))
    setMessages(updated)
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated))
  }

  const deleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id)
    setMessages(updated)
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated))
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050a14]/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dashboard-title"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-sm bg-[#0a1224] border border-[#00d2ff]/40 shadow-[0_0_60px_rgba(0,210,255,0.2)] overflow-hidden">
        {/* Top lightning highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#172847] bg-[#070d1a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#0f1b33] border border-[#00d2ff]/50 flex items-center justify-center text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.3)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#00d2ff] tracking-widest uppercase">
                  ROOT_ACCESS // CLEARANCE_LEVEL_5
                </span>
                <span className="px-1.5 py-0.2 rounded-xs bg-[#00d2ff]/20 text-[#00d2ff] text-[9px] font-mono font-bold">
                  VERIFIED_OWNER
                </span>
              </div>
              <h2 id="admin-dashboard-title" className="text-lg font-bold font-mono text-[#f1f5f9]">
                {language === 'vi'
                  ? 'Bảng Điều Khiển Quản Trị // Mai Anh Kiệt'
                  : 'Admin Command Center // Mai Anh Kiệt'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAdminModal}
            className="p-1.5 rounded-sm text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f1b33] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Identity Bar */}
        <div className="px-6 py-3 bg-[#081020] border-b border-[#172847] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <img
              src={user?.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=Kietteve'}
              alt={user?.displayName || 'Admin'}
              className="w-7 h-7 rounded-sm border border-[#00d2ff]"
            />
            <div>
              <span className="text-[#f1f5f9] font-bold block">{user?.displayName}</span>
              <span className="text-[#00d2ff] text-[11px]">{ADMIN_EMAIL}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#94a3b8]">
            <span>HUB: Thủ Dầu Một (63BDG02)</span>
            <span>ROLE: Senior Analyst & Developer</span>
          </div>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-sm bg-[#0f1b33] border border-[#172847]">
              <div className="text-[10px] font-mono text-[#94a3b8] uppercase mb-1">
                Hộp Thư Liên Hệ
              </div>
              <div className="text-xl font-bold font-mono text-[#00d2ff] flex items-center justify-between">
                <span>{messages.length}</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#00d2ff] text-[#050a14] font-bold">
                    {unreadCount} MỚI
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-sm bg-[#0f1b33] border border-[#172847]">
              <div className="text-[10px] font-mono text-[#94a3b8] uppercase mb-1">
                Đội Ngũ Tài Xế
              </div>
              <div className="text-xl font-bold font-mono text-[#f1f5f9]">~50 Drivers</div>
            </div>

            <div className="p-3.5 rounded-sm bg-[#0f1b33] border border-[#172847]">
              <div className="text-[10px] font-mono text-[#94a3b8] uppercase mb-1">
                Hạ Tầng Vite/React
              </div>
              <div className="text-xl font-bold font-mono text-[#34a853]">OPTIMAL</div>
            </div>

            <div className="p-3.5 rounded-sm bg-[#0f1b33] border border-[#172847]">
              <div className="text-[10px] font-mono text-[#94a3b8] uppercase mb-1">
                Quyền Hạn
              </div>
              <div className="text-xl font-bold font-mono text-[#00d2ff]">ROOT ADMIN</div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 border-b border-[#172847] pb-3 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('inbox')}
              className={`px-3 py-1.5 rounded-sm transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'inbox'
                  ? 'bg-[#00d2ff] text-[#050a14] font-bold'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Hộp Thư Tin Nhắn ({messages.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1.5 rounded-sm transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'telemetry'
                  ? 'bg-[#00d2ff] text-[#050a14] font-bold'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hồ Sơ & Hoạt Động</span>
            </button>
          </div>

          {/* Tab Content: Messages Inbox */}
          {activeTab === 'inbox' && (
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="p-8 text-center rounded-sm bg-[#0f1b33]/40 border border-[#172847] text-[#94a3b8] text-xs font-mono">
                  Hộp thư hiện đang trống. Chưa có tin nhắn mới nào.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-sm border transition-all ${
                      msg.read
                        ? 'bg-[#0f1b33]/50 border-[#172847]'
                        : 'bg-[#0d182e] border-[#00d2ff]/40 shadow-[0_0_15px_rgba(0,210,255,0.08)]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {!msg.read && (
                          <span className="w-2 h-2 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]" />
                        )}
                        <span className="font-mono font-bold text-sm text-[#f1f5f9]">
                          {msg.name}
                        </span>
                        <span className="text-xs text-[#00d2ff] font-mono">
                          &lt;{msg.email}&gt;
                        </span>
                        {msg.isVerifiedUser && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-[#34a853]/20 text-[#34a853] border border-[#34a853]/30">
                            GOOGLE_VERIFIED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748b]">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(msg.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-[#cbd5e1] font-semibold mb-2">
                      {msg.subject}
                    </div>

                    <p className="text-xs text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed mb-4">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-[#172847] text-xs font-mono">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="inline-flex items-center gap-1.5 text-[#00d2ff] hover:underline"
                      >
                        <Send className="w-3 h-3" />
                        <span>Phản Hồi Qua Email</span>
                      </a>

                      <div className="flex items-center gap-2">
                        {!msg.read && (
                          <button
                            type="button"
                            onClick={() => markAsRead(msg.id)}
                            className="inline-flex items-center gap-1 text-[#94a3b8] hover:text-[#34a853] transition-colors cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Đã đọc</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteMessage(msg.id)}
                          className="inline-flex items-center gap-1 text-[#94a3b8] hover:text-red-400 transition-colors cursor-pointer ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab Content: Telemetry */}
          {activeTab === 'telemetry' && (
            <div className="p-4 rounded-sm bg-[#0f1b33]/60 border border-[#172847] space-y-4 text-xs font-mono text-[#cbd5e1]">
              <div className="font-bold text-[#00d2ff] uppercase">[ACTIVE_SYSTEM_CREDENTIALS]</div>
              <ul className="space-y-2 text-[#94a3b8]">
                <li>• Quản trị viên: Mai Anh Kiệt</li>
                <li>• Email xác thực: {ADMIN_EMAIL}</li>
                <li>• Cơ sở hoạt động: Hub Thủ Dầu Một (Mã trạm: 63BDG02)</li>
                <li>• Nền tảng học thuật: Đại học FPT, Cơ sở TP.HCM</li>
                <li>• Trạng thái Git Remote: https://github.com/RonahDev/Kietfolio.git</li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#070d1a] border-t border-[#172847] flex items-center justify-between text-xs font-mono">
          <button
            type="button"
            onClick={() => signOutUser()}
            className="px-3 py-1.5 rounded-sm bg-red-950/30 hover:bg-red-900/40 text-red-300 border border-red-500/30 transition-colors cursor-pointer"
          >
            Đăng Xuất Quyền Admin
          </button>

          <button
            type="button"
            onClick={closeAdminModal}
            className="px-4 py-1.5 rounded-sm bg-[#0f1b33] hover:bg-[#172847] text-[#f1f5f9] transition-colors cursor-pointer"
          >
            Đóng Bảng Điều Khiển
          </button>
        </div>
      </div>
    </div>
  )
}

