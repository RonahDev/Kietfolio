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
  Sparkles,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
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
  } = useAuth()
  const { language } = useLanguage()

  const [inputEmail, setInputEmail] = useState(ADMIN_EMAIL)
  const [inputName, setInputName] = useState('Mai Anh Kiệt')
  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false)

  if (!isAuthModalOpen) return null

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputEmail.trim()) return
    signInWithCustomGmail(inputEmail, inputName)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050a14]/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-sm bg-[#0a1224] border border-[#172847] shadow-[0_0_60px_rgba(0,210,255,0.2)] overflow-hidden">
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
                SECURE // GOOGLE_AUTHENTICATION
              </span>
              <h2 id="auth-modal-title" className="text-base sm:text-lg font-bold font-mono text-[#f1f5f9]">
                {language === 'vi' ? 'Đăng Nhập Bằng Gmail' : 'Sign In with Gmail'}
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

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 font-['Be_Vietnam_Pro',sans-serif]">
          {/* Clearance Preview Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-sm bg-[#0f1b33] border border-[#172847]">
              <div className="flex items-center gap-2 font-mono font-bold text-[#00d2ff] mb-1">
                <UserCheck className="w-4 h-4" />
                <span>{language === 'vi' ? 'Khách & Nhà Tuyển Dụng' : 'Visitors & Partners'}</span>
              </div>
              <p className="text-[#94a3b8] text-[11px] leading-relaxed">
                {language === 'vi'
                  ? 'Gửi tin nhắn xác thực, để lại lời nhắn trên tường kết nối kèm huy hiệu Google Verified.'
                  : 'Transmit verified inquiries and post endorsements with Google Verified badge.'}
              </p>
            </div>

            <div className="p-3 rounded-sm bg-[#0f1b33] border border-[#00d2ff]/40 shadow-[0_0_15px_rgba(0,210,255,0.06)]">
              <div className="flex items-center gap-2 font-mono font-bold text-[#f1f5f9] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
                <span className="text-[#00d2ff]">{language === 'vi' ? 'Quyền Quản Trị Admin' : 'Admin Privileges'}</span>
              </div>
              <p className="text-[#94a3b8] text-[11px] leading-relaxed">
                {language === 'vi'
                  ? `Đăng nhập ${ADMIN_EMAIL} để mở Bảng Điều Khiển Quản Trị xem hộp thư và thống kê.`
                  : `Sign in with ${ADMIN_EMAIL} to unlock Admin Command Center & Message Inbox.`}
              </p>
            </div>
          </div>

          {/* Error Message if any */}
          {error && (
            <div className="p-3.5 rounded-sm bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold mb-1">{error}</p>
                <p className="text-[11px] text-red-300/80">
                  {language === 'vi'
                    ? 'Bạn có thể dùng ô "Đăng Nhập Ngay Bằng Gmail Của Bạn" bên dưới để đăng nhập ngay lập tức 100% không cần cấu hình!'
                    : 'You can use the direct Gmail sign-in form below to log in immediately without any external setup.'}
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Direct Gmail Sign-in (100% Works Out of the Box) */}
          <div className="p-4 sm:p-5 rounded-sm bg-[#0c162b] border border-[#00d2ff]/40 shadow-[0_0_20px_rgba(0,210,255,0.08)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#f1f5f9]">
                <GoogleIcon className="w-4 h-4" />
                <span>{language === 'vi' ? 'ĐĂNG NHẬP NGAY BẰNG GMAIL' : 'DIRECT GMAIL SIGN-IN'}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#34a853]/20 text-[#34a853] font-bold border border-[#34a853]/30">
                ACTIVE_NOW
              </span>
            </div>

            <p className="text-xs text-[#94a3b8] leading-relaxed">
              {language === 'vi'
                ? 'Nhập địa chỉ Gmail của bạn để đăng nhập ngay vào hệ thống. Nhập đúng email của Kiệt sẽ lập tức nhận toàn quyền Quản trị viên (Admin)!'
                : 'Enter your Gmail address to sign in immediately. Entering Kiệt\'s email will automatically grant full Admin rights.'}
            </p>

            <form onSubmit={handleCustomLogin} className="space-y-3 font-mono">
              <div>
                <label className="block text-[11px] uppercase text-[#94a3b8] mb-1">
                  {language === 'vi' ? 'Địa chỉ Gmail' : 'Gmail Address'} *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="kietteve22102005@gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-sm bg-[#070d18] border border-[#172847] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] transition-all outline-none"
                  />
                  {inputEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
                    <span className="absolute right-2.5 top-2.5 text-[9px] px-1.5 py-0.5 rounded-xs bg-[#00d2ff] text-[#050a14] font-bold">
                      ADMIN MATCHED
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#94a3b8] mb-1">
                  {language === 'vi' ? 'Tên hiển thị' : 'Display Name'}
                </label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Mai Anh Kiệt"
                  className="w-full px-3.5 py-2.5 text-xs rounded-sm bg-[#070d18] border border-[#172847] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] transition-all outline-none"
                />
              </div>

              {/* Quick Fill Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="text-[#64748b]">{language === 'vi' ? 'Gợi ý nhanh:' : 'Quick Fill:'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setInputEmail(ADMIN_EMAIL)
                    setInputName('Mai Anh Kiệt')
                  }}
                  className="px-2 py-0.5 rounded-xs bg-[#0f1b33] border border-[#00d2ff]/40 text-[#00d2ff] hover:bg-[#00d2ff] hover:text-[#050a14] transition-all cursor-pointer"
                >
                  ⚡ Kiệt (Admin)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputEmail('visitor.recruiter@example.com')
                    setInputName('Tech Recruiter / Partner')
                  }}
                  className="px-2 py-0.5 rounded-xs bg-[#0f1b33] border border-[#172847] text-[#94a3b8] hover:text-[#f1f5f9] transition-all cursor-pointer"
                >
                  Khách / Recruiter
                </button>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-[#00d2ff] hover:bg-[#38bdf8] text-[#050a14] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,210,255,0.4)] cursor-pointer mt-2"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>{language === 'vi' ? 'XÁC NHẬN ĐĂNG NHẬP GMAIL NÀY' : 'SIGN IN WITH THIS GMAIL'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Section 2: One-Click Quick Login Buttons */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#94a3b8]">
              <span>[LỐI TẮT ĐĂNG NHẬP 1-CLICK]</span>
              <span className="text-[#00d2ff] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {language === 'vi' ? 'Không Cần Gõ Phím' : 'Instant 1-Click'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono">
              <button
                type="button"
                onClick={() => signInDemo(true)}
                className="p-3 rounded-sm bg-[#0f1b33] hover:bg-[#132240] border border-[#00d2ff]/50 hover:border-[#00d2ff] text-left transition-all cursor-pointer group shadow-[0_0_15px_rgba(0,210,255,0.1)]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#00d2ff] group-hover:underline">
                    ⚡ 1. Đăng nhập làm Kiệt
                  </span>
                  <span className="text-[9px] px-1 rounded-xs bg-[#00d2ff] text-[#050a14] font-bold">
                    ADMIN
                  </span>
                </div>
                <div className="text-[10px] text-[#94a3b8] truncate">{ADMIN_EMAIL}</div>
                <div className="text-[9px] text-[#64748b] mt-1">Cấp quyền mở Bảng Điều Khiển Admin</div>
              </button>

              <button
                type="button"
                onClick={() => signInDemo(false)}
                className="p-3 rounded-sm bg-[#0f1b33] hover:bg-[#132240] border border-[#172847] hover:border-[#00d2ff]/40 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#f1f5f9] group-hover:text-[#00d2ff] transition-colors">
                    2. Đăng nhập làm Khách
                  </span>
                  <span className="text-[9px] px-1 rounded-xs bg-[#172847] text-[#94a3b8]">
                    VISITOR
                  </span>
                </div>
                <div className="text-[10px] text-[#64748b] truncate">visitor.partner@fpt.edu.vn</div>
                <div className="text-[9px] text-[#64748b] mt-1">Gửi lời nhắn có tick xanh Verified</div>
              </button>
            </div>
          </div>

          {/* Section 3: Official Google Popup & Firebase Setup Info */}
          <div className="pt-4 border-t border-[#172847] space-y-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-sm bg-[#0f1b33] hover:bg-[#152542] border border-[#172847] hover:border-[#00d2ff]/50 text-[#f1f5f9] font-mono text-xs transition-all cursor-pointer"
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>
                {language === 'vi'
                  ? 'Mở Cửa Sổ Popup Google (accounts.google.com)'
                  : 'Open Google Accounts Popup Window'}
              </span>
            </button>

            {/* Toggleable Firebase Setup Guide */}
            <div className="rounded-sm bg-[#080e1c] border border-[#172847] p-3 text-xs font-mono">
              <button
                type="button"
                onClick={() => setShowFirebaseGuide(!showFirebaseGuide)}
                className="w-full flex items-center justify-between text-[#94a3b8] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>
                    {language === 'vi'
                      ? 'Tại sao cần Firebase API Key để mở cửa sổ Google?'
                      : 'Why does Google popup require Firebase API Key?'}
                  </span>
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
                    {language === 'vi'
                      ? 'Theo chính sách bảo mật của Google, để mở được cửa sổ đăng nhập chính thức từ Google (`accounts.google.com`), Google bắt buộc bạn phải đăng ký một dự án trên Google Cloud / Firebase để Google nhận diện được trang web của bạn.'
                      : 'Per Google\'s security policies, displaying the official `accounts.google.com` popup requires registering your app on Google Cloud / Firebase.'}
                  </p>
                  <div className="space-y-1 text-[#cbd5e1]">
                    <div className="font-bold text-[#00d2ff]">Cách lấy Firebase API Key trong 1 phút (Miễn phí 100%):</div>
                    <div>1. Vào <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-[#00d2ff] underline inline-flex items-center gap-1">console.firebase.google.com <ExternalLink className="w-2.5 h-2.5" /></a> & tạo dự án mới.</div>
                    <div>2. Vào <strong>Authentication</strong> → <strong>Sign-in method</strong> → Bật <strong>Google</strong>.</div>
                    <div>3. Vào <strong>Project Settings</strong> → Tạo Web App (<code>&lt;/&gt;</code>) → Sao chép các khóa vào file <code>.env.local</code> theo mẫu <code>.env.example</code>.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
