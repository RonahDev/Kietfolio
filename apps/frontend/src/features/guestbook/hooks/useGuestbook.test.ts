import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useGuestbook } from './useGuestbook'

describe('useGuestbook Hook', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads initial entries properly', async () => {
    const { result } = renderHook(() => useGuestbook())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.entries.length).toBeGreaterThan(0)
    expect(result.current.error).toBeNull()
  })

  it('submits a new guestbook entry successfully', async () => {
    const { result } = renderHook(() => useGuestbook())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const initialCount = result.current.entries.length

    let ok = false
    await act(async () => {
      ok = await result.current.submitEntry({
        uid: 'user-test-456',
        name: 'QA Tester',
        email: 'qa@kietfolio.dev',
        message: 'Comprehensive QA test message for guestbook integrity.',
        role: 'member',
        isVerifiedGoogle: true,
      })
    })

    expect(ok).toBe(true)
    expect(result.current.postedSuccess).toBe(true)
    expect(result.current.entries.length).toBe(initialCount + 1)
    expect(result.current.entries[0].message).toContain('Comprehensive QA test')
  })
})

