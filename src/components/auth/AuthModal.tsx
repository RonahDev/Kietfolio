import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { GoogleIcon } from '../ui/GoogleIcon'
import { ADMIN_EMAIL } from '../../types/auth'
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  LogIn,
  UserPlus,
} from 'lucide-react'

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    registerWithEmail,
    signInWithEmail,
    signInWithGoogle,
    isLoading,
    error: authError,
    clearError,
    isFirebaseReady,
  } = useAuth()
  const { language } = useLanguage()

  const [userTab, setUserTab] = useState<'signin' | 'signup' | null>(null)
  const [prevModalKey, setPrevModalKey] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  // Synchronize modal state without cascading effect re-renders
  const currentKey = `${isAuthModalOpen}-${authModalMode}`
  if (prevModalKey !== currentKey) {
    setPrevModalKey(currentKey)
    setUserTab(null)
    setLocalError(null)
  }

  const activeTab: 'signin' | 'signup' =
    userTab ?? (authModalMode === 'signup' ? 'signup' : 'signin')

  // Sign In form fields
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [showSignInPassword, setShowSignInPassword] = useState(false)

  // Sign Up form fields
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('')
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)

  // Firebase setup guide
  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false)

  if (!isAuthModalOpen) return null

  const handleTabChange = (tab: 'signin' | 'signup') => {
    setUserTab(tab)
    setLocalError(null)
    clearError()
  }

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    if (!signInEmail.trim() || !signInPassword) {
      setLocalError(
        language === 'vi'
          ? 'Vui lòng nhập đầy đủ email và mật khẩu.'
          : 'Please enter both email and password.'
      )
      return
    }
    await signInWithEmail(signInEmail.trim(), signInPassword)
  }

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!signUpName.trim()) {
      setLocalError(language === 'vi' ? 'Vui lòng nhập họ và tên của bạn.' : 'Please enter your full name.')
      return
    }

    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setLocalError(language === 'vi' ? 'Vui lòng nhập email hợp lệ.' : 'Please enter a valid email address.')
      return
    }

    if (signUpPassword.length < 6) {
      setLocalError(
        language === 'vi'
          ? 'Mật khẩu bảo mật phải có ít nhất 6 ký tự.'
          : 'Password must be at least 6 characters.'
      )
      return
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setLocalError(
        language === 'vi'
          ? 'Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!'
          : 'Passwords do not match. Please re-enter.'
      )
      return
    }

    await registerWithEmail(signUpName.trim(), signUpEmail.trim(), signUpPassword)
  }

  const displayedError = localError || authError

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#050a14]/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-sm bg-[#0a1224] border border-[#172847] shadow-[0_0_60px_rgba(0,210,255,0.2)] overflow-hidden">
        {/* Top lightning cyan accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#172847] bg-[#070d1a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#0f1b33] border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.2)]">
              {activeTab === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#00d2ff] tracking-widest block uppercase">
                AUTHENTICATION // GOOGLE_OAUTH
              </span>
              <h2 id="auth-modal-title" className="text-base sm:text-lg font-bold font-mono text-[#f1f5f9]">
                {activeTab === 'signin'
                  ? language === 'vi'
                    ? 'Đăng Nhập Tài Khoản'
                    : 'Sign In to Your Account'
                  : language === 'vi'
                  ? 'Đăng Ký Tài Khoản Mới'
                  : 'Create a New Account'}
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

        {/* 2 Standard Tabs: ĐĂNG NHẬP vs ĐĂNG KÝ */}
        <div className="flex items-center border-b border-[#172847] bg-[#081020] text-xs font-mono">
          <button
            type="button"
            onClick={() => handleTabChange('signin')}
            className={`flex-1 py-3 px-3 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'signin'
                ? 'border-[#00d2ff] text-[#00d2ff] bg-[#0c182e] font-bold shadow-inner'
                : 'border-transparent text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0c1527]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'ĐĂNG NHẬP' : 'SIGN IN'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('signup')}
            className={`flex-1 py-3 px-3 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'signup'
                ? 'border-[#00d2ff] text-[#00d2ff] bg-[#0c182e] font-bold shadow-inner'
                : 'border-transparent text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0c1527]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'ĐĂNG KÝ' : 'SIGN UP'}</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 font-['Be_Vietnam_Pro',sans-serif]">
          {/* Display Alert on Error */}
          {displayedError && (
            <div className="p-3.5 rounded-sm bg-red-950/50 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{displayedError}</div>
            </div>
          )}

          {/* 🌟 GOOGLE OAUTH BUTTON (CỬA SỔ LIÊN KẾT TÀI KHOẢN GMAIL CỦA GOOGLE) */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-sm bg-white hover:bg-slate-100 text-[#050a14] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>
                {isLoading
                  ? language === 'vi'
                    ? 'Đang kết nối Google...'
                    : 'Connecting to Google...'
                  : activeTab === 'signin'
                  ? language === 'vi'
                    ? 'Tiếp tục với Google / Gmail'
                    : 'Continue with Google Account'
                  : language === 'vi'
                  ? 'Đăng ký nhanh bằng Google'
                  : 'Fast Sign Up with Google'}
              </span>
            </button>
            <p className="text-[11px] font-mono text-center text-[#64748b]">
              {language === 'vi'
                ? 'Mở cửa sổ chính thức của Google để liên kết tài khoản Gmail cá nhân của bạn'
                : 'Opens official Google window to link your personal Gmail account'}
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-[1px] bg-[#172847]" />
            <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">
              {language === 'vi' ? 'HOẶC VỚI EMAIL & MẬT KHẨU' : 'OR WITH EMAIL & PASSWORD'}
            </span>
            <div className="flex-1 h-[1px] bg-[#172847]" />
          </div>

          {/* TAB 1: FORM ĐĂNG NHẬP (Sign In) */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-3.5 font-mono text-xs animate-in fade-in">
              <div>
                <label className="block text-[11px] uppercase text-[#94a3b8] mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>{language === 'vi' ? 'Địa chỉ Email' : 'Email Address'}</span>
                </label>
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-sm bg-[#070d18] border border-[#172847] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#94a3b8] mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>{language === 'vi' ? 'Mật khẩu' : 'Password'}</span>
                </label>
                <div className="relative">
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-sm bg-[#070d18] border border-[#172847] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#f1f5f9] cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-[#00d2ff] hover:bg-[#38bdf8] text-[#050a14] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,210,255,0.35)] cursor-pointer mt-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {isLoading
                    ? language === 'vi'
                      ? 'Đang xác thực...'
                      : 'Verifying...'
                    : language === 'vi'
                    ? 'ĐĂNG NHẬP'
                    : 'SIGN IN'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 text-center text-xs font-['Be_Vietnam_Pro',sans-serif] text-[#94a3b8]">
                <span>{language === 'vi' ? 'Chưa có tài khoản? ' : "Don't have an account? "}</span>
                <button
                  type="button"
                  onClick={() => handleTabChange('signup')}
                  className="font-mono text-[#00d2ff] font-bold hover:underline cursor-pointer ml-1"
                >
                  {language === 'vi' ? 'Đăng ký ngay' : 'Sign Up now'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: FORM ĐĂNG KÝ (Sign Up) */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 font-mono text-xs animate-in fade-in">
              <div>
                <label className="block text-[11px] uppercase text-[#94a3b8] mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>{language === 'vi' ? 'Họ và tên hiển thị *' : 'Full Name *'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder={language === 'vi' ? 'Ví dụ: Nguyễn Văn A' : 'e.g. John Doe'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-sm bg-[#070d18] border border-[#172847] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#94a3b8] mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>{language === 'vi' ? 'Địa chỉ Email *' : 'Email Address *'}</span>
                </label>
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-sm bg-[#070d18] border border-[#172847] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#94a3b8] mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>{language === 'vi' ? 'Mật khẩu (tối thiểu 6 ký tự) *' : 'Password (min 6 chars) *'}</span>
                </label>
                <div className="relative">
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-sm bg-[#070d18] border border-[#172847] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#f1f5f9] cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#94a3b8] mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>{language === 'vi' ? 'Nhập lại mật khẩu *' : 'Confirm Password *'}</span>
                </label>
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs rounded-sm bg-[#070d18] border border-[#172847] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-[#00d2ff] hover:bg-[#38bdf8] text-[#050a14] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,210,255,0.35)] cursor-pointer mt-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {isLoading
                    ? language === 'vi'
                      ? 'Đang tạo tài khoản...'
                      : 'Creating account...'
                    : language === 'vi'
                    ? 'TẠO TÀI KHOẢN'
                    : 'CREATE ACCOUNT'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 text-center text-xs font-['Be_Vietnam_Pro',sans-serif] text-[#94a3b8]">
                <span>{language === 'vi' ? 'Đã có tài khoản? ' : 'Already have an account? '}</span>
                <button
                  type="button"
                  onClick={() => handleTabChange('signin')}
                  className="font-mono text-[#00d2ff] font-bold hover:underline cursor-pointer ml-1"
                >
                  {language === 'vi' ? 'Đăng nhập ngay' : 'Sign In now'}
                </button>
              </div>
            </form>
          )}

          {/* Firebase API Key Guide Accordion */}
          <div className="rounded-sm bg-[#080e1c] border border-[#172847] p-2.5 text-xs font-mono mt-2">
            <button
              type="button"
              onClick={() => setShowFirebaseGuide(!showFirebaseGuide)}
              className="w-full flex items-center justify-between text-[#94a3b8] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#00d2ff]" />
                <span className="text-[11px]">
                  {language === 'vi' ? 'Cấu hình liên kết Google OAuth' : 'Google OAuth Setup Guide'}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-xs font-bold border ${
                    isFirebaseReady
                      ? 'bg-[#34a853]/20 text-[#34a853] border-[#34a853]/30'
                      : 'bg-amber-950/30 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {isFirebaseReady ? 'ONLINE' : 'CẦN CẤU HÌNH FIREBASE'}
                </span>
                {showFirebaseGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {showFirebaseGuide && (
              <div className="mt-2.5 pt-2.5 border-t border-[#172847] space-y-2 text-[#94a3b8] text-[11px] leading-relaxed">
                <p className="text-[#38bdf8] font-bold">
                  ✓ Dự án Firebase đã được tích hợp trực tiếp ({`kietfolio-75531`})
                </p>
                <ol className="list-decimal pl-4 space-y-1.5 text-[#cbd5e1]">
                  <li>
                    Đảm bảo đã Bật <strong>Google</strong> trong <strong>Firebase Console</strong> $\rightarrow$ Authentication $\rightarrow$ Sign-in method.
                  </li>
                  <li>
                    Nếu triển khai trên Vercel hoặc domain riêng, thêm tên miền vào <strong>Firebase Console</strong> $\rightarrow$ Authentication $\rightarrow$ Settings $\rightarrow$ <strong>Authorized domains</strong>.
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#070d1a] border-t border-[#172847] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
          <span>AUTH: GOOGLE POPUP GATEWAY</span>
          <span>ADMIN: {ADMIN_EMAIL}</span>
        </div>
      </div>
    </div>
  )
}
