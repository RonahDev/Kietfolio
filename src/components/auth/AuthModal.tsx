import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { GoogleIcon } from '../ui/GoogleIcon'
import { ADMIN_EMAIL } from '../../types/auth'
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
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
    signInWithCustomGmail,
    signInDemo,
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

  const activeTab = userTab ?? authModalMode

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

  // Custom Gmail quick login
  const [showDirectGmail, setShowDirectGmail] = useState(false)
  const [directGmail, setDirectGmail] = useState('')
  const [directName, setDirectName] = useState('')

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

  const handleDirectGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    if (!directGmail.trim()) return
    signInWithCustomGmail(directGmail.trim(), directName.trim() || undefined)
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
                SECURITY // ACCESS_CONTROL
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

        {/* Primary Tabs: ĐĂNG NHẬP vs ĐĂNG KÝ */}
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
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 font-['Be_Vietnam_Pro',sans-serif]">
          {/* Display Alert on Error */}
          {displayedError && (
            <div className="p-3 rounded-sm bg-red-950/50 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{displayedError}</div>
            </div>
          )}

          {/* 1-Click Fast Google / Gmail Login Button */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-sm bg-white hover:bg-slate-100 text-[#050a14] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>
                {activeTab === 'signin'
                  ? language === 'vi'
                    ? 'Tiếp tục với Google / Gmail'
                    : 'Continue with Google Account'
                  : language === 'vi'
                  ? 'Đăng ký nhanh bằng Google'
                  : 'Fast Sign Up with Google'}
              </span>
            </button>

            {/* Direct Gmail Address Input (Expandable) */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowDirectGmail(!showDirectGmail)}
                className="text-[11px] font-mono text-[#94a3b8] hover:text-[#00d2ff] transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>
                  {language === 'vi'
                    ? 'Hoặc xác thực trực tiếp bằng địa chỉ Gmail'
                    : 'Or sign in directly with Gmail address'}
                </span>
                {showDirectGmail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showDirectGmail && (
                <form
                  onSubmit={handleDirectGmailSubmit}
                  className="mt-2.5 p-3 rounded-sm bg-[#081020] border border-[#172847] space-y-2.5 text-left animate-in fade-in"
                >
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#94a3b8] mb-1">
                      {language === 'vi' ? 'Địa chỉ Gmail của bạn *' : 'Your Gmail Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={directGmail}
                      onChange={(e) => setDirectGmail(e.target.value)}
                      placeholder="ban.cua.ban@gmail.com"
                      className="w-full px-3 py-2 text-xs font-mono rounded-sm bg-[#070d18] border border-[#172847] focus:border-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#94a3b8] mb-1">
                      {language === 'vi' ? 'Tên hiển thị (Tùy chọn)' : 'Display Name (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={directName}
                      onChange={(e) => setDirectName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3 py-2 text-xs font-mono rounded-sm bg-[#070d18] border border-[#172847] focus:border-[#00d2ff] text-[#f1f5f9] placeholder-[#64748b] outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-sm bg-[#0f1b33] hover:bg-[#172847] border border-[#00d2ff]/40 text-[#00d2ff] font-mono text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    {language === 'vi' ? 'Xác nhận Gmail' : 'Confirm Gmail'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-[1px] bg-[#172847]" />
            <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">
              {language === 'vi' ? 'HOẶC VỚI TÀI KHOẢN EMAIL' : 'OR WITH EMAIL ACCOUNT'}
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

              {/* Bottom switch to Sign Up */}
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

              {/* Quick Admin Access Shortcut for Kiệt */}
              <div className="pt-3 border-t border-[#172847] space-y-2">
                <div className="p-3 rounded-sm bg-[#0c162b] border border-[#00d2ff]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
                    <div className="text-[11px] font-mono text-[#f1f5f9]">
                      <span className="font-bold">Quản Trị Viên (Admin Kiệt)</span>
                      <span className="block text-[9px] text-[#64748b]">{ADMIN_EMAIL}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => signInDemo(true)}
                    className="px-2.5 py-1.5 rounded-xs bg-[#00d2ff] hover:bg-[#38bdf8] text-[#050a14] font-mono font-bold text-[10px] tracking-wider uppercase transition-all cursor-pointer shadow-[0_0_10px_rgba(0,210,255,0.3)] flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>1-CLICK</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: FORM ĐĂNG KÝ (Sign Up) */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3 font-mono text-xs animate-in fade-in">
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

              <div className="p-2.5 rounded-sm bg-[#081020] border border-[#172847] text-[11px] font-['Be_Vietnam_Pro',sans-serif] text-[#94a3b8] leading-relaxed">
                ℹ️ {language === 'vi'
                  ? 'Tài khoản đăng ký được cấp quyền Thành viên (MEMBER), cho phép gửi lời nhắn lên Sổ lưu bút và trải nghiệm các tính năng sắp ra mắt.'
                  : 'Registered accounts receive Member privileges, allowing verified guestbook posts and access to upcoming features.'}
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

              {/* Bottom switch to Sign In */}
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
                  {language === 'vi' ? 'Trợ giúp cấu hình Firebase OAuth' : 'Firebase OAuth Setup Helper'}
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
                  {isFirebaseReady ? 'ONLINE' : 'FALLBACK_READY'}
                </span>
                {showFirebaseGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {showFirebaseGuide && (
              <div className="mt-2.5 pt-2.5 border-t border-[#172847] space-y-2 text-[#94a3b8] text-[11px] leading-relaxed">
                <p>
                  Vào <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-[#00d2ff] underline inline-flex items-center gap-0.5">console.firebase.google.com <ExternalLink className="w-2.5 h-2.5" /></a> $\rightarrow$ Project Settings $\rightarrow$ Your apps:
                </p>
                <ul className="space-y-1 text-[#cbd5e1]">
                  <li>• Thêm biến <code>VITE_FIREBASE_API_KEY</code> giá trị bắt đầu bằng <code>AIzaSy...</code> lên Vercel.</li>
                  <li>• Hệ thống hỗ trợ lưu trữ kép: tài khoản đăng ký lưu an toàn trên Database trình duyệt và đồng bộ ngay lập tức!</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#070d1a] border-t border-[#172847] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
          <span>STORAGE: DUAL_ENGINE (FIREBASE + LOCAL)</span>
          <span>ADMIN: {ADMIN_EMAIL}</span>
        </div>
      </div>
    </div>
  )
}
