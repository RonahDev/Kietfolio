import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContactForm } from './useContactForm'
import type { AuthUser } from '@/types/auth'

describe('useContactForm Hook', () => {
  const mockUser: AuthUser = {
    uid: 'test-user-123',
    email: 'tester@example.com',
    displayName: 'Test Explorer',
    role: 'member',
    provider: 'google',
    photoURL: null,
    lastLoginAt: '2026-10-28T00:00:00.000Z',
  }

  it('initializes with default values from user session', () => {
    const { result } = renderHook(() => useContactForm(mockUser, 'en'))

    expect(result.current.formData.name).toBe('Test Explorer')
    expect(result.current.formData.email).toBe('tester@example.com')
    expect(result.current.formData.message).toBe('')
    expect(result.current.submitStatus).toBe('idle')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('updates form fields on handleChange', () => {
    const { result } = renderHook(() => useContactForm(null, 'en'))

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.formData.name).toBe('John Doe')
  })

  it('validates required fields on submission', async () => {
    const { result } = renderHook(() => useContactForm(null, 'vi'))

    let success = false
    await act(async () => {
      success = await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent)
    })

    expect(success).toBe(false)
    expect(result.current.submitStatus).toBe('error')
    expect(result.current.errors.name).toBeDefined()
    expect(result.current.errors.email).toBeDefined()
    expect(result.current.errors.message).toBeDefined()
  })
})
