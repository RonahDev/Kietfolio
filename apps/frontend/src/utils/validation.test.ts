import { describe, it, expect } from 'vitest'
import { validateContactForm } from './validation'

describe('validateContactForm', () => {
  const validData = {
    name: 'Mai Anh Kiệt',
    email: 'kiet.dev@example.com',
    subject: 'Project Inquiry',
    message: 'Hello, I would like to discuss a logistics software collaboration.',
    honeypot: '',
  }

  it('accepts valid contact form inputs', () => {
    const result = validateContactForm(validData, 'en')
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('rejects bot submission when honeypot is populated', () => {
    const botData = { ...validData, honeypot: 'spam_bot_input' }
    const result = validateContactForm(botData, 'en')
    expect(result.isValid).toBe(false)
    expect(result.errors.message).toBe('Automated submission rejected.')
  })

  it('enforces name length constraints in English', () => {
    const shortName = { ...validData, name: 'A' }
    const resShort = validateContactForm(shortName, 'en')
    expect(resShort.isValid).toBe(false)
    expect(resShort.errors.name).toBe('Name must be at least 2 characters.')

    const emptyName = { ...validData, name: '   ' }
    const resEmpty = validateContactForm(emptyName, 'en')
    expect(resEmpty.isValid).toBe(false)
    expect(resEmpty.errors.name).toBe('Name is required.')
  })

  it('enforces name length constraints in Vietnamese', () => {
    const emptyName = { ...validData, name: '' }
    const res = validateContactForm(emptyName, 'vi')
    expect(res.isValid).toBe(false)
    expect(res.errors.name).toBe('Vui lòng nhập họ và tên.')
  })

  it('validates email pattern correctly', () => {
    const invalidEmail = { ...validData, email: 'not-an-email' }
    const res = validateContactForm(invalidEmail, 'en')
    expect(res.isValid).toBe(false)
    expect(res.errors.email).toBe('Please provide a valid email address.')
  })

  it('enforces message minimum character length', () => {
    const shortMessage = { ...validData, message: 'Too short' }
    const res = validateContactForm(shortMessage, 'en')
    expect(res.isValid).toBe(false)
    expect(res.errors.message).toContain('at least 10 characters')
  })
})

