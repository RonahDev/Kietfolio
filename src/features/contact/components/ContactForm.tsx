import React from 'react'
import { useLanguage } from '@/hooks'
import { useAuth } from '@/features/auth'
import { useContactForm } from '../hooks/useContactForm'
import { profileData } from '@/data'
import { Button, GoogleIcon } from '@/components/ui'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Mail,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react'

export const ContactForm: React.FC = () => {
  const { t, language } = useLanguage()
  const { user, openAuthModal } = useAuth()

  const {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    copied,
    handleChange,
    handleApplyGoogleProfile,
    handleCopyEmail,
    handleSubmit,
  } = useContactForm(user, language)

  return (
    <div className="space-y-6">
      {/* Quick Direct Email Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-sm bg-[#0f1b33] border border-[#172847]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#0a1224] border border-[#172847] flex items-center justify-center text-[#00d2ff] shadow-[0_0_8px_rgba(0,210,255,0.2)]">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">
              Direct Contact
            </div>
            <div className="text-xs sm:text-sm font-mono font-medium text-[#f1f5f9]">
              {profileData.contactLinks.email}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleCopyEmail(profileData.contactLinks.email)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-[#0a1224] hover:bg-[#13223f] border border-[#172847] hover:border-[#00d2ff] text-[#94a3b8] hover:text-[#00d2ff] rounded-sm transition-all self-start sm:self-auto cursor-pointer"
          aria-label={t.contact.copyEmail}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#00d2ff]" />
              <span className="text-[#00d2ff] font-bold">{t.contact.emailCopied}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{t.contact.copyEmail}</span>
            </>
          )}
        </button>
      </div>

      {/* Google Auth Status Banner */}
      {user ? (
        <div className="p-3 rounded-sm bg-[#0c1a30] border border-[#00d2ff]/40 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 truncate">
            <img
              src={user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=Visitor'}
              alt={user.displayName || 'User'}
              className="w-6 h-6 rounded-full border border-[#00d2ff] shrink-0"
            />
            <span className="text-[#f1f5f9] truncate">
              {language === 'vi' ? 'Đang gửi dưới danh nghĩa:' : 'Transmitting as:'}{' '}
              <strong className="text-[#00d2ff]">{user.displayName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleApplyGoogleProfile}
              className="text-[10px] text-[#00d2ff] hover:underline cursor-pointer"
            >
              [{language === 'vi' ? 'Điền Tự Động' : 'Auto-fill'}]
            </button>
            <div className="flex items-center gap-1.5 text-[#34a853] font-bold text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GOOGLE_VERIFIED</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-sm bg-[#0a1224] border border-[#172847] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono">
          <span className="text-[#94a3b8]">
            {language === 'vi'
              ? 'Xác thực với Gmail để tự động điền & gắn huy hiệu đối tác?'
              : 'Sign in with Google to auto-fill & verify partner badge?'}
          </span>
          <button
            type="button"
            onClick={() => openAuthModal('signin')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#0f1b33] hover:bg-[#142444] border border-[#172847] hover:border-[#00d2ff] text-[#00d2ff] text-[11px] font-bold cursor-pointer transition-colors self-start sm:self-auto"
          >
            <GoogleIcon className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Đăng Nhập Gmail' : 'Sign In Google'}</span>
          </button>
        </div>
      )}

      {/* Structured Transmission Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4 font-['Be_Vietnam_Pro',sans-serif]">
        {/* Anti-spam Honeypot field (hidden from view) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="hp_field">Do not fill this field</label>
          <input
            id="hp_field"
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="contact_name"
              className="block text-xs font-mono uppercase text-[#94a3b8]"
            >
              {t.contact.formName} <span className="text-[#00d2ff]">*</span>
            </label>
            <input
              id="contact_name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Nguyen"
              className={`w-full px-3.5 py-2.5 text-sm font-mono rounded-sm bg-[#070d18] border text-[#f1f5f9] placeholder-[#64748b] transition-all focus-visible:outline-none ${
                errors.name
                  ? 'border-red-500/80 focus-visible:ring-2 focus-visible:ring-red-500'
                  : 'border-[#172847] focus-visible:border-[#00d2ff] focus-visible:ring-1 focus-visible:ring-[#00d2ff]'
              }`}
            />
            {errors.name && (
              <p className="text-xs font-mono text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact_email"
              className="block text-xs font-mono uppercase text-[#94a3b8]"
            >
              {t.contact.formEmail} <span className="text-[#00d2ff]">*</span>
            </label>
            <input
              id="contact_email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@domain.com"
              className={`w-full px-3.5 py-2.5 text-sm font-mono rounded-sm bg-[#070d18] border text-[#f1f5f9] placeholder-[#64748b] transition-all focus-visible:outline-none ${
                errors.email
                  ? 'border-red-500/80 focus-visible:ring-2 focus-visible:ring-red-500'
                  : 'border-[#172847] focus-visible:border-[#00d2ff] focus-visible:ring-1 focus-visible:ring-[#00d2ff]'
              }`}
            />
            {errors.email && (
              <p className="text-xs font-mono text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact_subject"
            className="block text-xs font-mono uppercase text-[#94a3b8]"
          >
            {t.contact.formSubject} <span className="text-[#00d2ff]">*</span>
          </label>
          <input
            id="contact_subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Collaboration on Full-Stack Application"
            className={`w-full px-3.5 py-2.5 text-sm font-mono rounded-sm bg-[#070d18] border text-[#f1f5f9] placeholder-[#64748b] transition-all focus-visible:outline-none ${
              errors.subject
                ? 'border-red-500/80 focus-visible:ring-2 focus-visible:ring-red-500'
                : 'border-[#172847] focus-visible:border-[#00d2ff] focus-visible:ring-1 focus-visible:ring-[#00d2ff]'
            }`}
          />
          {errors.subject && (
            <p className="text-xs font-mono text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.subject}</span>
            </p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact_message"
            className="block text-xs font-mono uppercase text-[#94a3b8]"
          >
            {t.contact.formMessage} <span className="text-[#00d2ff]">*</span>
          </label>
          <textarea
            id="contact_message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Share details regarding your technical inquiry or proposal..."
            className={`w-full px-3.5 py-2.5 text-sm font-mono rounded-sm bg-[#070d18] border text-[#f1f5f9] placeholder-[#64748b] transition-all focus-visible:outline-none resize-y ${
              errors.message
                ? 'border-red-500/80 focus-visible:ring-2 focus-visible:ring-red-500'
                : 'border-[#172847] focus-visible:border-[#00d2ff] focus-visible:ring-1 focus-visible:ring-[#00d2ff]'
            }`}
          />
          {errors.message && (
            <p className="text-xs font-mono text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        {/* Feedback states */}
        {submitStatus === 'success' && (
          <div className="p-3.5 rounded-sm bg-[#00d2ff]/10 border border-[#00d2ff]/40 text-xs font-mono text-[#00d2ff] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{t.contact.formSuccess}</span>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-3.5 rounded-sm bg-red-500/10 border border-red-500/40 text-xs font-mono text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{t.contact.formError}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full justify-center font-mono uppercase tracking-wider"
        >
          <Send className="w-4 h-4 mr-2" />
          <span>{isSubmitting ? t.contact.formSending : t.contact.formSubmit}</span>
        </Button>
      </form>
    </div>
  )
}
