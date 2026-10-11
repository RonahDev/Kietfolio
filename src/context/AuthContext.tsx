import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  auth,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  isFirebaseConfigured,
  type User,
} from '../services/firebase'
import { ADMIN_EMAIL, type AuthUser } from '../types/auth'
import { AuthContext } from './authTypes'

const DEMO_STORAGE_KEY = 'kietfolio_auth_demo_session'

const mapFirebaseUser = (firebaseUser: User): AuthUser => {
  const email = firebaseUser.email || ''
  const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || 'Google User',
    photoURL: firebaseUser.photoURL,
    role: isAdmin ? 'admin' : 'visitor',
    provider: 'google',
    lastLoginAt: new Date().toISOString(),
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedDemo = localStorage.getItem(DEMO_STORAGE_KEY)
      if (savedDemo) {
        return JSON.parse(savedDemo)
      }
    } catch {
      // Ignore storage read error
    }
    return null
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false)

  const isFirebaseReady = useMemo(() => isFirebaseConfigured(), [])

  useEffect(() => {
    if (!auth || !isFirebaseReady) return

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser))
      } else {
        const savedDemo = localStorage.getItem(DEMO_STORAGE_KEY)
        if (savedDemo) {
          try {
            setUser(JSON.parse(savedDemo))
          } catch {
            localStorage.removeItem(DEMO_STORAGE_KEY)
            setUser(null)
          }
        }
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [isFirebaseReady])

  const signInWithGoogle = useCallback(async () => {
    setError(null)
    setIsLoading(true)

    if (!auth || !googleProvider || !isFirebaseReady) {
      setIsLoading(false)
      setError('Firebase credentials not configured in environment. You can use Demo Sign-in below!')
      return
    }

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const mapped = mapFirebaseUser(result.user)
      setUser(mapped)
      localStorage.removeItem(DEMO_STORAGE_KEY)
      setIsAuthModalOpen(false)
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Google authentication failed. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [isFirebaseReady])

  const signInDemo = useCallback((asAdmin: boolean = false) => {
    setError(null)
    const demoUser: AuthUser = asAdmin
      ? {
          uid: 'demo_admin_kiet_uid',
          email: ADMIN_EMAIL,
          displayName: 'Mai Anh Kiệt (Hub Admin)',
          photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kietteve',
          role: 'admin',
          provider: 'demo',
          lastLoginAt: new Date().toISOString(),
        }
      : {
          uid: 'demo_visitor_recruiter_uid',
          email: 'visitor.partner@fpt.edu.vn',
          displayName: 'Tech Partner / Guest Recruiter',
          photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=GuestVisitor',
          role: 'visitor',
          provider: 'demo',
          lastLoginAt: new Date().toISOString(),
        }

    setUser(demoUser)
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser))
    setIsAuthModalOpen(false)
  }, [])

  const signInWithCustomGmail = useCallback((email: string, displayName?: string) => {
    setError(null)
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ (ví dụ: kietteve22102005@gmail.com)')
      return
    }

    const isAdmin = trimmedEmail === ADMIN_EMAIL.toLowerCase()
    const finalName = displayName?.trim() || (isAdmin ? 'Mai Anh Kiệt (Admin)' : trimmedEmail.split('@')[0])
    const customUser: AuthUser = {
      uid: `custom_${Date.now()}_${trimmedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: trimmedEmail,
      displayName: finalName,
      photoURL: isAdmin
        ? 'https://api.dicebear.com/7.x/bottts/svg?seed=Kietteve'
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`,
      role: isAdmin ? 'admin' : 'visitor',
      provider: 'demo',
      lastLoginAt: new Date().toISOString(),
    }

    setUser(customUser)
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(customUser))
    setIsAuthModalOpen(false)
  }, [])

  const signOutUser = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      if (auth && user?.provider === 'google') {
        await firebaseSignOut(auth)
      }
    } catch (err: unknown) {
      console.warn('Firebase signout warning:', err)
    } finally {
      localStorage.removeItem(DEMO_STORAGE_KEY)
      setUser(null)
      setIsAdminModalOpen(false)
      setIsLoading(false)
    }
  }, [user])

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), [])
  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false)
    setError(null)
  }, [])
  const openAdminModal = useCallback(() => setIsAdminModalOpen(true), [])
  const closeAdminModal = useCallback(() => setIsAdminModalOpen(false), [])
  const clearError = useCallback(() => setError(null), [])

  const isAdmin = useMemo(() => {
    return Boolean(user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())
  }, [user])

  const contextValue = useMemo(
    () => ({
      user,
      isAdmin,
      isLoading,
      error,
      isFirebaseReady,
      isAuthModalOpen,
      isAdminModalOpen,
      openAuthModal,
      closeAuthModal,
      openAdminModal,
      closeAdminModal,
      signInWithGoogle,
      signInWithCustomGmail,
      signInDemo,
      signOutUser,
      clearError,
    }),
    [
      user,
      isAdmin,
      isLoading,
      error,
      isFirebaseReady,
      isAuthModalOpen,
      isAdminModalOpen,
      openAuthModal,
      closeAuthModal,
      openAdminModal,
      closeAdminModal,
      signInWithGoogle,
      signInWithCustomGmail,
      signInDemo,
      signOutUser,
      clearError,
    ]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
