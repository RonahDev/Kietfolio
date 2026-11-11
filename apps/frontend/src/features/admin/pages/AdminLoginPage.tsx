import React, { useState } from 'react'
import { Eye, EyeOff, Shield, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAdminAuth } from '../context'

interface AdminLoginPageProps {
  onBackToHome?: () => void
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBackToHome }) => {
  const { login, isLoading, error } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [dismissError, setDismissError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setDismissError(false)

    if (!email.trim() || !password) {
      setFormError('Vui lòng nhập đầy đủ Email và Mật khẩu quản trị.')
      return
    }

    await login(email.trim(), password)
  }

  const handleFillDemoAdmin = () => {
    setEmail('admin@kietfolio.dev')
    setPassword('SecretAdminKey@2005')
    setFormError(null)
    setDismissError(true)
  }

  const activeError = formError || (!dismissError ? error : null)

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-[#fafafa] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Ambient Red & Gold Cinema Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#dc2626]/15 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Button */}
      {onBackToHome && (
        <button
          type="button"
          onClick={onBackToHome}
          className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18181b] border border-[#2b2b31] text-xs font-mono text-[#a1a1aa] hover:text-white hover:border-[#dc2626] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>VỀ TRANG CHỦ</span>
        </button>
      )}

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#111114] border border-[#2b2b31] rounded-xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] flex items-center justify-center text-white mx-auto shadow-[0_0_25px_rgba(220,38,38,0.5)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-white tracking-wide">
            KIETFOLIO ADMIN
          </h2>
          <p className="text-xs font-mono text-[#a1a1aa]">
            Cổng Đăng Nhập Quản Trị Hệ Thống Movie Hub & Digital Ecosystem
          </p>
        </div>

        {/* Error Notification */}
        {activeError && (
          <div className="p-3 rounded-md bg-rose-950/40 border border-rose-700/60 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{activeError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-[#a1a1aa] font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#dc2626]" />
              <span>EMAIL QUẢN TRỊ VIÊN</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kietfolio.dev"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181b] border border-[#2b2b31] text-white placeholder-[#71717a] outline-none focus:border-[#dc2626] transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[#a1a1aa] font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>MẬT KHẨU</span>
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-[#18181b] border border-[#2b2b31] text-white placeholder-[#71717a] outline-none focus:border-[#dc2626] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-lg bg-gradient-to-r from-[#dc2626] to-[#7f1d1d] hover:opacity-95 text-white font-bold tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>XÁC THỰC PHIÊN QUẢN TRỊ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Fill Demo Credentials */}
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="w-full py-2 px-3 rounded-lg bg-[#18181b] border border-[#2b2b31] hover:border-[#dc2626]/50 text-[#a1a1aa] hover:text-white transition-colors text-[11px] font-mono flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>⚡ Điền nhanh tài khoản Quản trị viên (Master Admin)</span>
          </button>
        </form>

        {/* Security Notice & Credential Hints */}
        <div className="pt-4 border-t border-[#2b2b31] text-center space-y-1.5">
          <p className="text-[10px] font-mono text-[#d4af37]/90 leading-relaxed">
            Tài khoản Super Admin: <span className="text-white font-semibold">admin@kietfolio.dev</span>
            <span className="mx-1 text-[#71717a]">|</span>
            Mật khẩu: <span className="text-white font-semibold">SecretAdminKey@2005</span>
          </p>
          <p className="text-[10px] font-mono text-[#71717a] leading-relaxed">
            Hệ thống tự động kích hoạt khóa phiên nếu nhập sai quá 5 lần. Mọi địa chỉ IP và nỗ lực
            truy cập đều được ghi lại vào nhật ký kiểm toán.
          </p>
        </div>
      </div>
    </div>
  )
}
