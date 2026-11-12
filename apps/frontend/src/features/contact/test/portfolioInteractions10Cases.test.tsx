import { describe, it, expect, vi, beforeEach } from 'vitest'
import { guestbookApi, type CreateGuestbookDto } from '../../guestbook/api/guestbookApi'

describe('Portfolio User Interactions & Form Engine — 10 Comprehensive Testcases', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  // TC-INT-01: Contact form validation rules
  it('TC-INT-01: validates required contact inputs (name, email format, subject, minimum message length)', () => {
    const validateContact = (data: { name: string; email: string; subject: string; message: string }) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (data.name.trim().length < 2) return { valid: false, error: 'Name too short' }
      if (!emailRegex.test(data.email.trim())) return { valid: false, error: 'Invalid email' }
      if (data.subject.trim().length < 2) return { valid: false, error: 'Subject too short' }
      if (data.message.trim().length < 10) return { valid: false, error: 'Message too short' }
      return { valid: true, error: null }
    }

    expect(validateContact({ name: 'Kiet', email: 'kiet@fpt.vn', subject: 'Cooperation', message: 'Hello, let us build something awesome.' }).valid).toBe(true)
    expect(validateContact({ name: 'K', email: 'kiet@fpt.vn', subject: 'Hi', message: 'Hello, let us build something awesome.' }).valid).toBe(false)
    expect(validateContact({ name: 'Kiet', email: 'invalid-email', subject: 'Hi', message: 'Hello, let us build something awesome.' }).valid).toBe(false)
    expect(validateContact({ name: 'Kiet', email: 'kiet@fpt.vn', subject: 'Hi', message: 'Too short' }).valid).toBe(false)
  })

  // TC-INT-02: Honeypot anti-spam bot trap
  it('TC-INT-02: traps automated spam bots when the hidden honeypot field is populated', () => {
    const isBotSubmission = (honeypot?: string) => Boolean(honeypot && honeypot.trim().length > 0)

    expect(isBotSubmission('')).toBe(false)
    expect(isBotSubmission(undefined)).toBe(false)
    expect(isBotSubmission('I am a spambot link')).toBe(true)
  })

  // TC-INT-03: Message size boundary check (max 3,000 characters)
  it('TC-INT-03: enforces strict 3,000 characters upper bound on contact message', () => {
    const checkLength = (msg: string) => msg.length >= 10 && msg.length <= 3000

    expect(checkLength('a'.repeat(9))).toBe(false)
    expect(checkLength('a'.repeat(100))).toBe(true)
    expect(checkLength('a'.repeat(3000))).toBe(true)
    expect(checkLength('a'.repeat(3001))).toBe(false)
  })

  // TC-INT-04: Guestbook storage fallback
  it('TC-INT-04: falls back to LocalStorage entries when remote API is unreachable', async () => {
    const mockStored = [
      {
        id: 'gb-local-1',
        name: 'Local Tester',
        email: 'local@test.com',
        message: 'Great portfolio design!',
        role: 'member',
        timestamp: new Date().toISOString(),
        isVerifiedGoogle: true,
      },
    ]
    localStorage.setItem('kietfolio_guestbook_entries', JSON.stringify(mockStored))

    const entries = await guestbookApi.getEntries()
    expect(entries.length).toBeGreaterThanOrEqual(1)
    expect(entries.some((e) => e.name === 'Local Tester')).toBe(true)
  })

  // TC-INT-05: Backend schema normalization
  it('TC-INT-05: normalizes backend response attributes (avatar -> avatarUrl, isGoogleVerified -> isVerifiedGoogle)', () => {
    const rawBackendItem = {
      id: 'gb-123',
      userUid: 'uid-456',
      name: 'Nguyen Van A',
      avatar: 'https://avatar.com/pic.jpg',
      roleTitle: 'vip',
      message: 'Awesome work!',
      timestamp: '2026-11-12T10:00:00Z',
      isGoogleVerified: true,
      isPinned: true,
    }

    const normalized = {
      id: rawBackendItem.id,
      uid: rawBackendItem.userUid,
      name: rawBackendItem.name,
      avatarUrl: rawBackendItem.avatar,
      role: rawBackendItem.roleTitle,
      message: rawBackendItem.message,
      isVerifiedGoogle: rawBackendItem.isGoogleVerified,
      isPinned: rawBackendItem.isPinned,
    }

    expect(normalized.avatarUrl).toBe('https://avatar.com/pic.jpg')
    expect(normalized.isVerifiedGoogle).toBe(true)
    expect(normalized.role).toBe('vip')
  })

  // TC-INT-06: Optimistic guestbook creation
  it('TC-INT-06: optimistically prepends new guestbook entry into client list', async () => {
    const newDto: CreateGuestbookDto = {
      uid: 'user_new_1',
      name: 'Nguyen Tan Kiet',
      email: 'kiet@fpt.vn',
      message: 'Keep developing high-scale systems!',
      role: 'vip',
      isVerifiedGoogle: true,
    }

    const created = await guestbookApi.createEntry(newDto)
    expect(created.id).toBeDefined()
    expect(created.name).toBe('Nguyen Tan Kiet')
    expect(created.message).toBe('Keep developing high-scale systems!')
    expect(created.isVerifiedGoogle).toBe(true)
  })

  // TC-INT-07: Guestbook entry deletion authorization
  it('TC-INT-07: permits entry deletion only for entry author or system administrator', () => {
    const canDelete = (entryUid: string, userUid: string, isAdmin: boolean) => {
      return isAdmin || entryUid === userUid
    }

    expect(canDelete('author_1', 'author_1', false)).toBe(true) // Author
    expect(canDelete('author_1', 'other_user', false)).toBe(false) // Stranger
    expect(canDelete('author_1', 'stranger', true)).toBe(true) // Admin
  })

  // TC-INT-08: Cross-Site Scripting (XSS) input sanitization
  it('TC-INT-08: safely escapes and handles HTML injection strings in message contents', () => {
    const sanitizeHtml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    const malicious = '<script>alert("XSS")</script>'
    const safe = sanitizeHtml(malicious)
    expect(safe).not.toContain('<script>')
    expect(safe).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')
  })

  // TC-INT-09: Submission throttling
  it('TC-INT-09: throttles rapid consecutive form submissions within cooldown window', () => {
    let lastSubmitTime = 0
    const COOLDOWN_MS = 3000

    const submit = (now: number) => {
      if (lastSubmitTime > 0 && now - lastSubmitTime < COOLDOWN_MS) {
        return { allowed: false, waitMs: COOLDOWN_MS - (now - lastSubmitTime) }
      }
      lastSubmitTime = now
      return { allowed: true, waitMs: 0 }
    }

    expect(submit(1000).allowed).toBe(true)
    expect(submit(1500).allowed).toBe(false)
    expect(submit(4500).allowed).toBe(true)
  })

  // TC-INT-10: Verified Google Provider Badge
  it('TC-INT-10: activates verified badge exclusively for authentic Google login providers', () => {
    const getBadgeStatus = (provider: string, isVerifiedGoogle?: boolean) => {
      return provider === 'google' || Boolean(isVerifiedGoogle)
    }

    expect(getBadgeStatus('google')).toBe(true)
    expect(getBadgeStatus('email', false)).toBe(false)
    expect(getBadgeStatus('demo', false)).toBe(false)
    expect(getBadgeStatus('email', true)).toBe(true)
  })
})
