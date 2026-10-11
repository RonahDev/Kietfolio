import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { AuthProvider } from './AuthContext'
import { useAuth } from '../hooks/useAuth'
import { ADMIN_EMAIL } from '../types/auth'

describe('AuthContext & Google Authentication Flow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  )

  it('initializes with null user and isAdmin as false by default', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeNull()
    expect(result.current.isAdmin).toBe(false)
    expect(result.current.isAuthModalOpen).toBe(false)
    expect(result.current.isAdminModalOpen).toBe(false)
  })

  it('allows logging in as a verified visitor in demo mode', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.signInDemo(false)
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.role).toBe('visitor')
    expect(result.current.isAdmin).toBe(false)
    expect(result.current.user?.email).not.toBe(ADMIN_EMAIL)
  })

  it('grants full Admin clearance when logging in as Kiệt (kietteve22102005@gmail.com)', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.signInDemo(true)
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.email).toBe(ADMIN_EMAIL)
    expect(result.current.user?.role).toBe('admin')
    expect(result.current.isAdmin).toBe(true)
  })

  it('correctly logs out and clears active user session', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.signInDemo(true)
    })
    expect(result.current.isAdmin).toBe(true)

    await act(async () => {
      await result.current.signOutUser()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAdmin).toBe(false)
  })

  it('opens and closes auth modal and admin modal correctly', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.openAuthModal()
    })
    expect(result.current.isAuthModalOpen).toBe(true)

    act(() => {
      result.current.closeAuthModal()
    })
    expect(result.current.isAuthModalOpen).toBe(false)

    act(() => {
      result.current.openAdminModal()
    })
    expect(result.current.isAdminModalOpen).toBe(true)

    act(() => {
      result.current.closeAdminModal()
    })
    expect(result.current.isAdminModalOpen).toBe(false)
  })

  it('authenticates custom Gmail address and grants admin if email is kietteve22102005@gmail.com', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.signInWithCustomGmail(ADMIN_EMAIL, 'Mai Anh Kiệt')
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.email).toBe(ADMIN_EMAIL)
    expect(result.current.user?.displayName).toBe('Mai Anh Kiệt')
    expect(result.current.isAdmin).toBe(true)

    // Test with regular visitor email
    act(() => {
      result.current.signInWithCustomGmail('recruiter.top@shopee.vn', 'Shopee HR')
    })

    expect(result.current.user?.email).toBe('recruiter.top@shopee.vn')
    expect(result.current.user?.displayName).toBe('Shopee HR')
    expect(result.current.user?.role).toBe('visitor')
    expect(result.current.isAdmin).toBe(false)
  })
})

