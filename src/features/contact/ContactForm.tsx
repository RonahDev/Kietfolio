import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { profileData } from '../../data/profile'
import { validateContactForm } from '../../utils/validation'
import type { ContactFormData, FormValidationErrors } from '../../types'
import { Button } from '../../components/ui/Button'
import { Send, CheckCircle2, AlertCircle, Mail, Copy, Check } from 'lucide-react'

export const ContactForm: React.FC = () => {
  const { t, language } = useLanguage()

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '',
  })

  const [errors, setErrors] = useState<FormValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [copied, setCopied] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field-specific error as user types
    if (errors[name as keyof FormValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profileData.contactLinks.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Validate Form Data
    const validation = validateContactForm(formData, language)
    if (!validation.isValid) {
      setErrors(validation.errors)
      setSubmitStatus('error')
      return
    }

    setErrors({})
    setIsSubmitting(true)

    // Simulate validation and open client email dispatch honestly
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')

      // Prepare mailto link with encoded parameters to deliver message directly
      const subject = encodeURIComponent(`[Portfolio Inquiry] ${formData.subject}`)
      const body = encodeURIComponent(
        `From: ${formData.name} <${formData.email}>\n\nMessage:\n${formData.message}`
      )
      window.location.href = `mailto:${profileData.contactLinks.email}?subject=${subject}&body=${body}`
    }, 600)
  }

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
          onClick={handleCopyEmail}
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
