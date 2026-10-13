import { useState, useCallback } from 'react'
import { contactApi } from '../services/api/contactApi'
import { validateContactForm } from '../utils/validation'
import { SITE_CONFIG } from '../config/site'
import type { ContactFormData, FormValidationErrors } from '../types'
import type { AuthUser } from '../types/auth'

export function useContactForm(user: AuthUser | null, language: 'en' | 'vi') {
  const [formData, setFormData] = useState<ContactFormData>({
    name: user?.displayName || '',
    email: user?.email || '',
    subject: '',
    message: '',
    honeypot: '',
  })

  const [errors, setErrors] = useState<FormValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [copied, setCopied] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      setErrors((prev) => {
        if (prev[name as keyof FormValidationErrors]) {
          return { ...prev, [name]: undefined }
        }
        return prev
      })
    },
    []
  )

  const handleApplyGoogleProfile = useCallback(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
      }))
    }
  }, [user])

  const handleCopyEmail = useCallback(async (emailToCopy: string) => {
    try {
      await navigator.clipboard.writeText(emailToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), SITE_CONFIG.timeouts.clipboardFeedbackMs)
    } catch {
      // Ignore clipboard write failure
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<boolean> => {
      e.preventDefault()

      const validation = validateContactForm(formData, language)
      if (!validation.isValid) {
        setErrors(validation.errors)
        setSubmitStatus('error')
        return false
      }

      setIsSubmitting(true)
      setSubmitStatus('idle')

      try {
        await contactApi.sendMessage(formData, user?.uid)
        setSubmitStatus('success')
        setFormData({
          name: user?.displayName || '',
          email: user?.email || '',
          subject: '',
          message: '',
          honeypot: '',
        })
        return true
      } catch {
        setSubmitStatus('error')
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, language, user]
  )

  return {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    copied,
    handleChange,
    handleApplyGoogleProfile,
    handleCopyEmail,
    handleSubmit,
  }
}
