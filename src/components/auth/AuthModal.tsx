import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { GoogleIcon } from '../ui/GoogleIcon'
import { ADMIN_EMAIL } from '../../types/auth'
import {
  X,
  ShieldCheck,
  UserCheck,
  Lock,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react'

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    signInWithCustomGmail,
    signInDemo,
    isLoading,
    error,
    isFirebaseReady,
  } = useAuth()
  const { language } = useLanguage()

  const [activeTab, setActiveTab] = useState<'quick' | 'visitor' | 'popup'>('quick')
  const [visitorEmail, setVisitorEmail] = useState('')
  const [visitorName, setVisitorName] = useState('')
  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false)

  if (!isAuthModalOpen) return null

  const handleVisitorLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!visitorEmail.trim()) return
    signInWithCustomGmail(visitorEmail, visitorName)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050a14]/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-sm bg-[#0a1224] border border-[#172847] shadow-[0_0_60px_rgba(0,210,255,0.2)] overflow-hidden">
        {/* Top lightning glow line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#172847] bg-[#070d1a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#0f1b33] border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.2)]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#00d2ff] tracking-widest block uppercase">
                AUTHENTICATION // GOOGLE_GATEWAY
              </span>
              <h2 id="auth-modal-title" className="text-base sm:text-lg font-bold font-mono text-[#f1f5f9]">
                {language === 'vi' ? 'Đăng Nhập Với Google (Gmail)' : 'Sign In with Google Account'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1.5 rounded-sm text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f1b33] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#172847] bg-[#081020] text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-3 px-2 text-center transition-all cursor-pointer border-b-2 ${
              activeTab === 'quick'
                ? 'border-[#00d2ff] text-[#00d2ff] bg-[#0c182e] font-bold'
                : 'border-transparent text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            ⚡ {language === 'vi' ? 'Chủ Website (Admin)' : 'Admin Login'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visitor')}
            className={`flex-1 py-3 px-2 text-center transition-all cursor-pointer border-b-2 ${
              activeTab === 'visitor'
                ? 'border-[#00d2ff] text-[#00d2ff] bg-[#0c182e] font-bold'
                : 'border-transparent text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            👥 {language === 'vi' ? 'Khách / Đối Tác' : 'Visitor Login'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('popup')}
            className={`flex-1 py-3 px-2 text-center transition-all cursor-pointer border-b-2 ${
              activeTab === 'popup'
                ? 'border-[#00d2ff] text-[#00d2ff] bg-[#0c182e] font-bold'
                : 'border-transparent text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            🌐 {language === 'vi' ? 'Popup Google' : 'Google Popup'}
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 font-['Be_Vietnam_Pro',sans-serif]">
          {/* Error Message if any */}
          {error && (
            <div className="p-3.5 rounded-sm bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* TAB 1: Quick Admin Login for Kiệt */}
          {activeTab === 'quick' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-5 rounded-sm bg-[#0c162b] border border-[#00d2ff]/40 shadow-[0_0_20px_rgba(0,210,255,0.08)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#00d2ff]" />
                    <span className="font-mono text-xs font-bold text-[#f1f5f9]">
                      TÀI KHOẢN QUẢN TRỊ VIÊN
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-xs bg-[#00d2ff] text-[#050a14] font-bold">
                    ROOT_ADMIN
                  </span>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-sm bg-[#070d18] border border-[#172847]">
                  <img
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=Kietteve"
                    alt="Mai Anh Kiệt"
                    className="w-10 h-10 rounded-sm border border-[#00d2ff] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-mono font-bold text-sm text-[#f1f5f9]">
                      Mai Anh Kiệt
                    </div>
                    <div className="font-mono text-xs text-[#00d2ff] truncate">
                      {ADMIN_EMAIL}
                    </div>
                    <div className="text-[10px] text-[#64748b]">
                      Hub Thủ Dầu Một (63BDG02) · FPT University
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Đăng nhập ngay với tài khoản của bạn để mở khóa toàn bộ quyền Quản trị viên, xem hộp thư tin nhắn và thống kê vận hành.
                </p>

                <button
                  type="button"
                  onClick={() => signInDemo(true)}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-sm bg-[#00d2ff] hover:bg-[#38bdf8] text-[#050a14] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(0,210,255,0.4)] cursor-pointer"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>ĐĂNG NHẬP NGAY (TOÀN QUYỀN ADMIN)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Visitor / Partner Login */}
          {activeTab === 'visitor' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-5 rounded-sm bg-[#0c162b] border border-[#172847] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#34a853]" />
                    <span className="font-mono text-xs font-bold text-[#f1f5f9]">
                      ĐĂNG NHẬP KHÁCH / ĐỐI TÁC
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-xs bg-[#34a853]/20 text-[#34a853] font-bold border border-[#34a853]/30">
                    GOOGLE_VERIFIED
                  </span>
                </div>

                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Nhập địa chỉ Gmail của bạn để nhận huy hiệu đối tác xác thực, tự động điền form liên hệ và đăng lời nhắn lên sổ lưu bút.
                </p>

                <form onSubmit={handleVisitorLogin} className="space-y-3 font-mono">
                  <div>
                    <label className="block text-[11px] uppercase text-[#94a3b8] mb-1">
                      Địa chỉ Gmail của bạn *
                    </label>
                    <input
                      type="email"
                      required
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      placeholder="ban.cua.ban@gmail.com"
                      className="w-full px-3.5 py-2.5 text-xs rounded-sm bg-[#070d18] border border-[#172847] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-[#94a3b8] mb-1">
                      Họ và tên hiển thị (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 text-xs rounded-sm bg-[#070d18] border border-[#172847] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] transition-all outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-[#f1f5f9] hover:bg-white text-[#050a14] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-pointer mt-1"
                  >
                    <GoogleIcon className="w-4 h-4" />
                    <span>XÁC NHẬN ĐĂNG NHẬP GMAIL</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="pt-2 border-t border-[#172847] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#64748b]">Hoặc thử nhanh:</span>
                  <button
                    type="button"
                    onClick={() => signInDemo(false)}
                    className="text-[#00d2ff] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Đăng nhập mẫu làm Khách Recruiter</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Official Google Popup */}
          {activeTab === 'popup' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-5 rounded-sm bg-[#0c162b] border border-[#172847] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#f1f5f9] uppercase">
                    CỬA SỔ POPUP GOOGLE (ACCOUNTS.GOOGLE.COM)
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-xs font-bold border ${
                      isFirebaseReady
                        ? 'bg-[#34a853]/20 text-[#34a853] border-[#34a853]/30'
                        : 'bg-amber-950/30 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {isFirebaseReady ? 'ONLINE' : 'CẦN FIREBASE API KEY'}
                  </span>
                </div>

                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Mở cửa sổ chọn tài khoản chính thức từ máy chủ Google. Để tính năng này hoạt động, bạn cần cấu hình khóa Firebase API Key hợp lệ trên Vercel.
                </p>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => signInWithGoogle()}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-sm bg-white hover:bg-slate-100 text-[#050a14] font-mono font-bold text-xs uppercase transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer disabled:opacity-50"
                >
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                  <span>
                    {isLoading
                      ? 'Đang kết nối dịch vụ Google...'
                      : 'MỞ CỬA SỔ POPUP GOOGLE'}
                  </span>
                </button>

                {/* Guide Accordion */}
                <div className="rounded-sm bg-[#080e1c] border border-[#172847] p-3 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setShowFirebaseGuide(!showFirebaseGuide)}
                    className="w-full flex items-center justify-between text-[#94a3b8] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#00d2ff]" />
                      <span>Hướng dẫn lấy Firebase API Key chuẩn</span>
                    </span>
                    {showFirebaseGuide ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {showFirebaseGuide && (
                    <div className="mt-3 pt-3 border-t border-[#172847] space-y-2 text-[#94a3b8] text-[11px] leading-relaxed">
                      <p>
                        Vào <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-[#00d2ff] underline inline-flex items-center gap-0.5">console.firebase.google.com <ExternalLink className="w-2.5 h-2.5" /></a> $\rightarrow$ Project Settings (General) $\rightarrow$ Your apps:
                      </p>
                      <ul className="space-y-1 text-[#cbd5e1]">
                        <li>• Copy giá trị <code>apiKey</code> bắt đầu bằng <code>AIzaSy...</code> (bỏ dấu ngoặc kép <code>&quot;</code>).</li>
                        <li>• Thêm vào Vercel (chọn Type: <strong>Config</strong>).</li>
                        <li>• Bấm <strong>Redeploy</strong> lại trên Vercel.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#070d1a] border-t border-[#172847] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
          <span>TOKEN: SHA-256 ENCRYPTED</span>
          <span>ADMIN: {ADMIN_EMAIL}</span>
        </div>
      </div>
    </div>
  )
}
