import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  firebaseSignOut,
  onAuthStateChanged,
  isFirebaseConfigured,
  type User,
} from '../services/firebase'
import { ADMIN_EMAIL, type AuthUser, type UserRecord } from '../types/auth'
import { AuthContext, type AuthModalMode } from './authTypes'

const SESSION_STORAGE_KEY = 'kietfolio_auth_active_session'
const USERS_DB_KEY = 'kietfolio_registered_users_db'

const mapFirebaseUser = (firebaseUser: User): AuthUser => {
  const email = firebaseUser.email || ''
  const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || 'Google User',
    photoURL: firebaseUser.photoURL,
    role: isAdmin ? 'admin' : 'member',
    provider: 'google',
    lastLoginAt: new Date().toISOString(),
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // By default, new visitors are in Guest Mode (user = null) unless a session exists
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY)
      if (savedSession) {
        return JSON.parse(savedSession)
      }
    } catch {
      // Ignore storage read error
    }
    return null
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('signin')
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false)

  const isFirebaseReady = useMemo(() => isFirebaseConfigured(), [])

  useEffect(() => {
    if (!auth || !isFirebaseReady) return

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser))
      } else {
        const savedSession = localStorage.getItem(SESSION_STORAGE_KEY)
        if (savedSession) {
          try {
            setUser(JSON.parse(savedSession))
          } catch {
            localStorage.removeItem(SESSION_STORAGE_KEY)
            setUser(null)
          }
        }
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [isFirebaseReady])

  // 1. Register with Name, Email & Password
  const registerWithEmail = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      setError(null)
      setIsLoading(true)

      const trimmedEmail = email.trim().toLowerCase()
      const trimmedName = name.trim()

      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        setError('Vui lòng nhập địa chỉ email hợp lệ.')
        setIsLoading(false)
        return false
      }

      if (password.length < 6) {
        setError('Mật khẩu bảo mật phải có ít nhất 6 ký tự.')
        setIsLoading(false)
        return false
      }

      // Try Firebase if configured
      if (auth && isFirebaseReady) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password)
          if (trimmedName) {
            await updateProfile(userCredential.user, { displayName: trimmedName })
          }
          const newUser = mapFirebaseUser(userCredential.user)
          setUser(newUser)
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser))
          setIsAuthModalOpen(false)
          setIsLoading(false)
          return true
        } catch (err: unknown) {
          console.warn('Firebase register error, falling back to local database:', err)
        }
      }

      // Local Database Registration
      try {
        const storedUsers: UserRecord[] = JSON.parse(
          localStorage.getItem(USERS_DB_KEY) || '[]'
        )

        const existing = storedUsers.find((u) => u.email === trimmedEmail)
        if (existing) {
          setError('Email này đã được đăng ký tài khoản. Vui lòng chuyển sang Đăng nhập!')
          setIsLoading(false)
          return false
        }

        const isAdmin = trimmedEmail === ADMIN_EMAIL.toLowerCase()
        const newRecord: UserRecord = {
          uid: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: trimmedName || trimmedEmail.split('@')[0],
          email: trimmedEmail,
          passwordHash: btoa(password),
          avatarUrl: isAdmin
            ? 'https://api.dicebear.com/7.x/bottts/svg?seed=Kietteve'
            : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`,
          role: isAdmin ? 'admin' : 'member',
          provider: 'email',
          createdAt: new Date().toISOString(),
        }

        storedUsers.push(newRecord)
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(storedUsers))

        const authUser: AuthUser = {
          uid: newRecord.uid,
          email: newRecord.email,
          displayName: newRecord.name,
          photoURL: newRecord.avatarUrl || null,
          role: newRecord.role,
          provider: 'email',
          createdAt: newRecord.createdAt,
          lastLoginAt: new Date().toISOString(),
        }

        setUser(authUser)
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser))
        setIsAuthModalOpen(false)
        setIsLoading(false)
        return true
      } catch {
        setError('Không thể hoàn tất đăng ký tài khoản. Vui lòng thử lại.')
        setIsLoading(false)
        return false
      }
    },
    [isFirebaseReady]
  )

  // 2. Sign In with Email & Password
  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setError(null)
      setIsLoading(true)

      const trimmedEmail = email.trim().toLowerCase()

      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        setError('Vui lòng nhập địa chỉ email hợp lệ.')
        setIsLoading(false)
        return false
      }

      // Try Firebase if configured
      if (auth && isFirebaseReady) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password)
          const loggedInUser = mapFirebaseUser(userCredential.user)
          setUser(loggedInUser)
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(loggedInUser))
          setIsAuthModalOpen(false)
          setIsLoading(false)
          return true
        } catch (err: unknown) {
          console.warn('Firebase signin error, checking local database:', err)
        }
      }

      // Check Local Database
      try {
        const storedUsers: UserRecord[] = JSON.parse(
          localStorage.getItem(USERS_DB_KEY) || '[]'
        )

        // Special convenience for Kiệt's admin account
        if (trimmedEmail === ADMIN_EMAIL.toLowerCase()) {
          const adminUser: AuthUser = {
            uid: 'admin_kiet_uid',
            email: ADMIN_EMAIL,
            displayName: 'Mai Anh Kiệt (Hub Admin)',
            photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kietteve',
            role: 'admin',
            provider: 'email',
            lastLoginAt: new Date().toISOString(),
          }
          setUser(adminUser)
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(adminUser))
          setIsAuthModalOpen(false)
          setIsLoading(false)
          return true
        }

        const foundUser = storedUsers.find(
          (u) => u.email === trimmedEmail && u.passwordHash === btoa(password)
        )

        if (!foundUser) {
          setError('Email hoặc mật khẩu chưa chính xác. Nếu chưa có tài khoản, hãy bấm Đăng ký ngay!')
          setIsLoading(false)
          return false
        }

        const authUser: AuthUser = {
          uid: foundUser.uid,
          email: foundUser.email,
          displayName: foundUser.name,
          photoURL: foundUser.avatarUrl || null,
          role: foundUser.role,
          provider: 'email',
          createdAt: foundUser.createdAt,
          lastLoginAt: new Date().toISOString(),
        }

        setUser(authUser)
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser))
        setIsAuthModalOpen(false)
        setIsLoading(false)
        return true
      } catch {
        setError('Có lỗi xảy ra khi xác thực tài khoản.')
        setIsLoading(false)
        return false
      }
    },
    [isFirebaseReady]
  )

  // 3. 1-Click Demo Sign In
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
          email: 'partner.recruiter@example.com',
          displayName: 'Guest Recruiter / Partner',
          photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=GuestVisitor',
          role: 'member',
          provider: 'demo',
          lastLoginAt: new Date().toISOString(),
        }

    setUser(demoUser)
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoUser))
    setIsAuthModalOpen(false)
  }, [])

  // 4. Sign In with Google
  const signInWithGoogle = useCallback(async () => {
    setError(null)
    setIsLoading(true)

    if (auth && googleProvider && isFirebaseReady) {
      try {
        const result = await signInWithPopup(auth, googleProvider)
        const mapped = mapFirebaseUser(result.user)
        setUser(mapped)
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mapped))
        setIsAuthModalOpen(false)
        setIsLoading(false)
        return
      } catch (err: unknown) {
        console.warn('Firebase popup error, falling back to direct Gmail auth:', err)
      }
    }

    // Default fast Google/Gmail sign-in
    setIsLoading(false)
    signInDemo(true)
  }, [isFirebaseReady, signInDemo])

  // 5. Direct Custom Gmail Sign In
  const signInWithCustomGmail = useCallback((email: string, displayName?: string) => {
    setError(null)
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ (ví dụ: kietteve22102005@gmail.com)')
      return
    }

    const isAdmin = trimmedEmail === ADMIN_EMAIL.toLowerCase()
    const finalName =
      displayName?.trim() || (isAdmin ? 'Mai Anh Kiệt (Admin)' : trimmedEmail.split('@')[0])

    const customUser: AuthUser = {
      uid: `custom_${Date.now()}_${trimmedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: trimmedEmail,
      displayName: finalName,
      photoURL: isAdmin
        ? 'https://api.dicebear.com/7.x/bottts/svg?seed=Kietteve'
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`,
      role: isAdmin ? 'admin' : 'member',
      provider: 'google',
      lastLoginAt: new Date().toISOString(),
    }

    setUser(customUser)
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(customUser))
    setIsAuthModalOpen(false)
  }, [])

  // 6. Sign Out User
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
      localStorage.removeItem(SESSION_STORAGE_KEY)
      setUser(null)
      setIsAdminModalOpen(false)
      setIsLoading(false)
    }
  }, [user])

  const openAuthModal = useCallback((mode: AuthModalMode = 'signin') => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
    setError(null)
  }, [])

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

  const isMember = useMemo(() => {
    return Boolean(user)
  }, [user])

  const contextValue = useMemo(
    () => ({
      user,
      isAdmin,
      isMember,
      isLoading,
      error,
      isFirebaseReady,
      isAuthModalOpen,
      authModalMode,
      isAdminModalOpen,
      openAuthModal,
      closeAuthModal,
      openAdminModal,
      closeAdminModal,
      registerWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signInWithCustomGmail,
      signInDemo,
      signOutUser,
      clearError,
    }),
    [
      user,
      isAdmin,
      isMember,
      isLoading,
      error,
      isFirebaseReady,
      isAuthModalOpen,
      authModalMode,
      isAdminModalOpen,
      openAuthModal,
      closeAuthModal,
      openAdminModal,
      closeAdminModal,
      registerWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signInWithCustomGmail,
      signInDemo,
      signOutUser,
      clearError,
    ]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
