import React from 'react'
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
} from 'lucide-react'

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    signInDemo,
    isLoading,
    error,
    isFirebaseReady,
  } = useAuth()
  const { language } = useLanguage()

  if (!isAuthModalOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050a14]/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-sm bg-[#0a1224] border border-[#172847] shadow-[0_0_50px_rgba(0,210,255,0.15)] overflow-hidden">
        {/* Top lightning glow line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#172847]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#0f1b33] border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.2)]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#00d2ff] tracking-widest block uppercase">
                SECURE // GOOGLE_OAUTH_2.0
              </span>
              <h2 id="auth-modal-title" className="text-lg font-bold font-mono text-[#f1f5f9]">
                {language === 'vi' ? 'Xác Thực & Đăng Nhập Gmail' : 'Google Authentication Gateway'}
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

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Notice Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-sm bg-[#0f1b33] border border-[#172847]">
              <div className="flex items-center gap-2 font-mono font-bold text-[#00d2ff] mb-1.5">
                <UserCheck className="w-4 h-4" />
                <span>{language === 'vi' ? 'Khách & Đối Tác' : 'Visitors & Partners'}</span>
              </div>
              <p className="text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif] text-[11px] leading-relaxed">
                {language === 'vi'
                  ? 'Gửi tin nhắn liên hệ được xác thực, tránh bị lọc spam và để lại lời nhắn trên sổ lưu bút.'
                  : 'Send verified messages, bypass spam filters, and leave verified guestbook endorsements.'}
              </p>
            </div>

            <div className="p-3.5 rounded-sm bg-[#0f1b33] border border-[#172847]">
              <div className="flex items-center gap-2 font-mono font-bold text-[#f1f5f9] mb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
                <span>{language === 'vi' ? 'Quyền Quản Trị' : 'Admin Privileges'}</span>
              </div>
              <p className="text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif] text-[11px] leading-relaxed">
                {language === 'vi'
                  ? `Đăng nhập bằng ${ADMIN_EMAIL} để mở khóa Bảng Điều Khiển Quản Trị (Admin Dashboard).`
                  : `Signing in with ${ADMIN_EMAIL} unlocks exclusive site admin telemetry and messaging inbox.`}
              </p>
            </div>
          </div>

          {/* Error Message if any */}
          {error && (
            <div className="p-3 rounded-sm bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Action Button: Google Sign-In */}
          <div>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-sm bg-[#f1f5f9] hover:bg-white text-[#050a14] font-medium text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(0,210,255,0.35)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <GoogleIcon className="w-5 h-5 shrink-0" />
              <span className="font-mono font-bold tracking-tight">
                {isLoading
                  ? language === 'vi'
                    ? 'Đang kết nối dịch vụ Google...'
                    : 'Connecting Google Gateway...'
                  : language === 'vi'
                  ? 'Tiếp tục với Google / Gmail'
                  : 'Continue with Google Account'}
              </span>
            </button>

            {!isFirebaseReady && (
              <p className="mt-2 text-[11px] font-mono text-[#64748b] text-center flex items-center justify-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#00d2ff]" />
                <span>
                  {language === 'vi'
                    ? 'Chưa cấu hình Firebase API key? Bạn có thể dùng chế độ Demo bên dưới!'
                    : 'Firebase API key not set? Use instant Demo Mode below.'}
                </span>
              </p>
            )}
          </div>

          {/* Demo Mode / Quick Test Selector */}
          <div className="pt-4 border-t border-[#172847] space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#64748b]">
              <span>[DEMO_SANDBOX_LOGIN]</span>
              <span className="text-[#00d2ff] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {language === 'vi' ? 'Thử Nghiệm Ngay' : 'Instant Preview'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => signInDemo(false)}
                className="px-3 py-2 rounded-sm bg-[#0f1b33] hover:bg-[#132240] border border-[#172847] hover:border-[#00d2ff]/40 text-left transition-colors cursor-pointer group"
              >
                <div className="text-[11px] font-mono font-bold text-[#f1f5f9] group-hover:text-[#00d2ff] transition-colors">
                  {language === 'vi' ? '1. Đăng nhập làm Khách' : '1. Sign in as Visitor'}
                </div>
                <div className="text-[10px] text-[#64748b] truncate">
                  visitor.partner@fpt.edu.vn
                </div>
              </button>

              <button
                type="button"
                onClick={() => signInDemo(true)}
                className="px-3 py-2 rounded-sm bg-[#0f1b33] hover:bg-[#132240] border border-[#00d2ff]/30 hover:border-[#00d2ff] text-left transition-colors cursor-pointer group shadow-[0_0_10px_rgba(0,210,255,0.05)]"
              >
                <div className="text-[11px] font-mono font-bold text-[#00d2ff] flex items-center justify-between">
                  <span>{language === 'vi' ? '2. Đăng nhập làm Kiệt' : '2. Sign in as Kiệt'}</span>
                  <span className="text-[9px] px-1 rounded-xs bg-[#00d2ff]/10 text-[#00d2ff]">
                    ADMIN
                  </span>
                </div>
                <div className="text-[10px] text-[#94a3b8] truncate">
                  {ADMIN_EMAIL}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#080e1c] border-t border-[#172847] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
          <span>TOKEN: SHA-256 ENCRYPTED</span>
          <span>SPX_HUB_TELEMETRY // READY</span>
        </div>
      </div>
    </div>
  )
}

