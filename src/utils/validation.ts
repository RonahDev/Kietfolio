import type { ContactFormData, FormValidationErrors } from '../types'

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export function validateContactForm(
  data: ContactFormData,
  lang: 'en' | 'vi' = 'en'
): { isValid: boolean; errors: FormValidationErrors } {
  const errors: FormValidationErrors = {}

  // Check honeypot for bot traffic
  if (data.honeypot.trim() !== '') {
    return {
      isValid: false,
      errors: {
        message: lang === 'en' ? 'Automated submission rejected.' : 'Yêu cầu tự động bị từ chối.',
      },
    }
  }

  // Name validation
  const trimmedName = data.name.trim()
  if (!trimmedName) {
    errors.name = lang === 'en' ? 'Name is required.' : 'Vui lòng nhập họ và tên.'
  } else if (trimmedName.length < 2) {
    errors.name = lang === 'en' ? 'Name must be at least 2 characters.' : 'Tên phải có ít nhất 2 ký tự.'
  } else if (trimmedName.length > 80) {
    errors.name = lang === 'en' ? 'Name cannot exceed 80 characters.' : 'Tên không được quá 80 ký tự.'
  }

  // Email validation
  const trimmedEmail = data.email.trim()
  if (!trimmedEmail) {
    errors.email = lang === 'en' ? 'Email address is required.' : 'Vui lòng nhập địa chỉ email.'
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = lang === 'en' ? 'Please provide a valid email address.' : 'Địa chỉ email không hợp lệ.'
  }

  // Subject validation
  const trimmedSubject = data.subject.trim()
  if (!trimmedSubject) {
    errors.subject = lang === 'en' ? 'Subject is required.' : 'Vui lòng nhập chủ đề.'
  } else if (trimmedSubject.length < 3) {
    errors.subject = lang === 'en' ? 'Subject must be at least 3 characters.' : 'Chủ đề phải có ít nhất 3 ký tự.'
  } else if (trimmedSubject.length > 100) {
    errors.subject = lang === 'en' ? 'Subject cannot exceed 100 characters.' : 'Chủ đề không được quá 100 ký tự.'
  }

  // Message validation
  const trimmedMessage = data.message.trim()
  if (!trimmedMessage) {
    errors.message = lang === 'en' ? 'Message content is required.' : 'Vui lòng nhập nội dung tin nhắn.'
  } else if (trimmedMessage.length < 10) {
    errors.message =
      lang === 'en'
        ? 'Message must be at least 10 characters for meaningful context.'
        : 'Nội dung tin nhắn cần tối thiểu 10 ký tự.'
  } else if (trimmedMessage.length > 2500) {
    errors.message = lang === 'en' ? 'Message cannot exceed 2500 characters.' : 'Nội dung không vượt quá 2500 ký tự.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

