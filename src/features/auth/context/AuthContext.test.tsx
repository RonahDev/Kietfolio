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
    expect(result.current.user?.role).toBe('member')
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

  it('opens and closes auth modal and admin modal correctly with modes', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.openAuthModal('signup')
    })
    expect(result.current.isAuthModalOpen).toBe(true)
    expect(result.current.authModalMode).toBe('signup')

    act(() => {
      result.current.closeAuthModal()
    })
    expect(result.current.isAuthModalOpen).toBe(false)

    act(() => {
      result.current.openAuthModal('signin')
    })
    expect(result.current.isAuthModalOpen).toBe(true)
    expect(result.current.authModalMode).toBe('signin')

    act(() => {
      result.current.closeAuthModal()
    })

    act(() => {
      result.current.openAdminModal()
    })
    expect(result.current.isAdminModalOpen).toBe(true)

    act(() => {
      result.current.closeAdminModal()
    })
    expect(result.current.isAdminModalOpen).toBe(false)
  })

  it('prevents unauthorized admin elevation through unverified custom email and requires password', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    // 1. Trying to impersonate Kiệt's admin email via unverified custom input is rejected
    act(() => {
      result.current.signInWithCustomGmail(ADMIN_EMAIL, 'Mai Anh Kiệt')
    })

    expect(result.current.user).toBeNull()
    expect(result.current.error).toBeTruthy()

    // 2. Normal visitor personal Gmail signs in successfully as verified Member
    act(() => {
      result.current.signInWithCustomGmail('visitor.guest@gmail.com', 'Visitor Guest')
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.email).toBe('visitor.guest@gmail.com')
    expect(result.current.user?.role).toBe('member')
    expect(result.current.isAdmin).toBe(false)

    // Sign out
    await act(async () => {
      await result.current.signOutUser()
    })

    // 2. Logging in with Kiệt's admin email using a wrong password fails
    let failLogin = false
    await act(async () => {
      failLogin = await result.current.signInWithEmail(ADMIN_EMAIL, 'wrongPassword123')
    })
    expect(failLogin).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.isAdmin).toBe(false)

    // 3. Registering and logging in with correct credentials grants Admin
    let regAdmin = false
    await act(async () => {
      regAdmin = await result.current.registerWithEmail(
        'Mai Anh Kiệt (Hub Admin)',
        ADMIN_EMAIL,
        'SecretAdminKey@2005'
      )
    })
    expect(regAdmin).toBe(true)
    expect(result.current.isAdmin).toBe(true)
    expect(result.current.user?.role).toBe('admin')

    // Sign out
    await act(async () => {
      await result.current.signOutUser()
    })

    // Sign back in with correct password grants admin
    let loginAdmin = false
    await act(async () => {
      loginAdmin = await result.current.signInWithEmail(ADMIN_EMAIL, 'SecretAdminKey@2005')
    })
    expect(loginAdmin).toBe(true)
    expect(result.current.isAdmin).toBe(true)
    expect(result.current.user?.role).toBe('admin')
  })

  it('handles email registration and sign in with password', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    let regSuccess = false
    await act(async () => {
      regSuccess = await result.current.registerWithEmail(
        'Nguyễn Thành Nam',
        'nam.nguyen@testcorp.com',
        'securePass123'
      )
    })

    expect(regSuccess).toBe(true)
    expect(result.current.user?.email).toBe('nam.nguyen@testcorp.com')
    expect(result.current.user?.displayName).toBe('Nguyễn Thành Nam')
    expect(result.current.user?.role).toBe('member')

    // Sign out
    await act(async () => {
      await result.current.signOutUser()
    })
    expect(result.current.user).toBeNull()

    // Sign back in with registered credentials
    let loginSuccess = false
    await act(async () => {
      loginSuccess = await result.current.signInWithEmail(
        'nam.nguyen@testcorp.com',
        'securePass123'
      )
    })

    expect(loginSuccess).toBe(true)
    expect(result.current.user?.email).toBe('nam.nguyen@testcorp.com')
    expect(result.current.user?.displayName).toBe('Nguyễn Thành Nam')

    // Sign in with wrong password fails
    await act(async () => {
      await result.current.signOutUser()
    })

    let wrongPassSuccess = false
    await act(async () => {
      wrongPassSuccess = await result.current.signInWithEmail(
        'nam.nguyen@testcorp.com',
        'wrongPassword'
      )
    })

    expect(wrongPassSuccess).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.error).toBeTruthy()
  })
})

