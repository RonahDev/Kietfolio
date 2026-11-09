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
} from '@/services/firebase'
import { ADMIN_EMAIL, ADMIN_AUTHORIZED_EMAILS, type AuthUser, type UserRecord, type UserRole } from '../types/auth'
import { SITE_CONFIG } from '@/config/site'
import { AuthContext, type AuthModalMode } from './authTypes'

const SESSION_STORAGE_KEY = SITE_CONFIG.storageKeys.session
const USERS_DB_KEY = SITE_CONFIG.storageKeys.usersDb
const JWT_TOKEN_KEY = SITE_CONFIG.storageKeys.jwtToken

const mapFirebaseUser = (firebaseUser: User): AuthUser => {
  const email = firebaseUser.email || ''
  const isAdmin = ADMIN_AUTHORIZED_EMAILS.includes(email.toLowerCase())
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

function triggerCelebratoryWhale() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('kietfolio:summon-whale', { detail: { force: true } })
    )
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
  const [isVipModalOpen, setIsVipModalOpen] = useState<boolean>(false)

  const isFirebaseReady = useMemo(() => isFirebaseConfigured(), [])

  useEffect(() => {
    // 1. Verify and restore session from backend API if JWT token is stored
    const jwtToken = localStorage.getItem(JWT_TOKEN_KEY)
    if (jwtToken) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
        .then((res) => res.json())
        .then((resData) => {
          if (resData?.success && resData?.data?.user) {
            const apiUser = resData.data.user
            const mappedUser: AuthUser = {
              uid: apiUser.uid,
              email: apiUser.email,
              displayName: apiUser.displayName || apiUser.email?.split('@')[0] || 'User',
              photoURL: apiUser.photoURL || null,
              role: apiUser.role === 'admin' ? 'admin' : 'member',
              provider: apiUser.provider === 'google' ? 'google' : 'email',
              lastLoginAt: new Date().toISOString(),
            }
            setUser(mappedUser)
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mappedUser))
          } else {
            localStorage.removeItem(JWT_TOKEN_KEY)
          }
        })
        .catch(() => {
          // Backend offline; keep existing local session
        })
    }

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

  // 1. Register with Name, Email & Password (PostgreSQL DB + Bcrypt)
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

      // Try Backend REST API (PostgreSQL + Bcrypt + JWT)
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: trimmedEmail,
            password,
            displayName: trimmedName,
          }),
        })

        const resData = await response.json().catch(() => null)
        if (response.ok && resData?.success && resData?.data) {
          const { user: apiUser, token } = resData.data
          localStorage.setItem(JWT_TOKEN_KEY, token)
          const authUser: AuthUser = {
            uid: apiUser.uid,
            email: apiUser.email,
            displayName: apiUser.displayName || trimmedName,
            photoURL: apiUser.photoURL || null,
            role: apiUser.role === 'admin' ? 'admin' : 'member',
            provider: 'email',
            lastLoginAt: new Date().toISOString(),
          }

          // Also persist into local database so offline or reload always recognizes the account
          try {
            const storedUsers: UserRecord[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]')
            if (!storedUsers.some((u) => u.email === trimmedEmail)) {
              storedUsers.push({
                uid: authUser.uid,
                name: authUser.displayName || trimmedName,
                email: trimmedEmail,
                passwordHash: btoa(password),
                avatarUrl: authUser.photoURL || undefined,
                role: authUser.role,
                provider: 'email',
                createdAt: new Date().toISOString(),
              })
              localStorage.setItem(USERS_DB_KEY, JSON.stringify(storedUsers))
            }
          } catch {}

          setUser(authUser)
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser))
          setIsAuthModalOpen(false)
          setIsLoading(false)
          triggerCelebratoryWhale()
          return true
        } else if (!response.ok && resData?.error) {
          // If the backend specifically returned a duplicate error
          if (typeof resData.error === 'string' && resData.error.includes('đã được đăng ký')) {
            setError(resData.error)
            setIsLoading(false)
            return false
          }
        }
      } catch {
        // Backend service is offline/unreachable; proceed to fallback
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
          triggerCelebratoryWhale()
          return true
        } catch {
          // Firebase unavailable or offline, seamlessly fallback to local database
        }
      }

      // Local Database Registration Fallback (Test/Offline Mode)
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

        const isAdmin = ADMIN_AUTHORIZED_EMAILS.includes(trimmedEmail)
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
        triggerCelebratoryWhale()
        return true
      } catch {
        setError('Không thể hoàn tất đăng ký tài khoản. Vui lòng thử lại.')
        setIsLoading(false)
        return false
      }
    },
    [isFirebaseReady]
  )

  // 2. Sign In with Email & Password (PostgreSQL DB + Bcrypt)
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

      // Try Backend REST API (PostgreSQL + Bcrypt + JWT)
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: trimmedEmail,
            password,
          }),
        })

        const resData = await response.json().catch(() => null)
        if (response.ok && resData?.success && resData?.data) {
          const { user: apiUser, token } = resData.data
          localStorage.setItem(JWT_TOKEN_KEY, token)
          const authUser: AuthUser = {
            uid: apiUser.uid,
            email: apiUser.email,
            displayName: apiUser.displayName || trimmedEmail.split('@')[0],
            photoURL: apiUser.photoURL || null,
            role: apiUser.role === 'admin' ? 'admin' : 'member',
            provider: 'email',
            lastLoginAt: new Date().toISOString(),
          }
          setUser(authUser)
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser))
          setIsAuthModalOpen(false)
          setIsLoading(false)
          triggerCelebratoryWhale()
          return true
        } else if (!response.ok && resData?.error) {
          setError(resData.error)
          setIsLoading(false)
          return false
        }
      } catch {
        // Backend service is offline/unreachable; proceed to fallback
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
          triggerCelebratoryWhale()
          return true
        } catch {
          // Firebase unavailable or offline, seamlessly fallback to local database
        }
      }

      // Check Local Database Fallback (Test/Offline Mode)
      try {
        const storedUsers: UserRecord[] = JSON.parse(
          localStorage.getItem(USERS_DB_KEY) || '[]'
        )

        const isAdminEmail = ADMIN_AUTHORIZED_EMAILS.includes(trimmedEmail)
        const adminMasterPassword = SITE_CONFIG.admin.defaultPassword

        const foundUser = storedUsers.find(
          (u) => u.email === trimmedEmail && u.passwordHash === btoa(password)
        )

        const isMasterAdminMatch =
          isAdminEmail &&
          password === adminMasterPassword

        if (!foundUser && !isMasterAdminMatch) {
          // Check if email was registered but wrong password was provided
          const userWithEmail = storedUsers.find((u) => u.email === trimmedEmail)
          if (userWithEmail || isAdminEmail) {
            setError('Mật khẩu chưa chính xác. Vui lòng kiểm tra lại!')
          } else {
            setError('Email này chưa được đăng ký tài khoản. Vui lòng chuyển sang tab Đăng ký!')
          }
          setIsLoading(false)
          return false
        }

        const authUser: AuthUser = isMasterAdminMatch && !foundUser
          ? {
              uid: 'admin_kiet_uid',
              email: ADMIN_EMAIL,
              displayName: 'Mai Anh Kiệt (Hub Admin)',
              photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kietteve',
              role: 'admin',
              provider: 'email',
              lastLoginAt: new Date().toISOString(),
            }
          : {
              uid: foundUser!.uid,
              email: foundUser!.email,
              displayName: foundUser!.name,
              photoURL: foundUser!.avatarUrl || null,
              role: isAdminEmail ? 'admin' : foundUser!.role,
              provider: 'email',
              createdAt: foundUser!.createdAt,
              lastLoginAt: new Date().toISOString(),
            }

        setUser(authUser)
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser))
        setIsAuthModalOpen(false)
        setIsLoading(false)
        triggerCelebratoryWhale()
        return true
      } catch {
        setError('Có lỗi xảy ra khi xác thực tài khoản.')
        setIsLoading(false)
        return false
      }
    },
    [isFirebaseReady]
  )

  // 3. 1-Click Demo Sign In (strictly for test / local demo)
  const signInDemo = useCallback((asAdmin: boolean | 'admin' | 'vip' | 'member' = false) => {
    setError(null)
    const isAdminTarget = asAdmin === true || asAdmin === 'admin'
    const isVipTarget = asAdmin === 'vip'

    const demoUser: AuthUser = isAdminTarget
      ? {
          uid: 'demo_admin_kiet_uid',
          email: ADMIN_EMAIL,
          displayName: 'Mai Anh Kiệt (Hub Admin)',
          photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kietteve',
          role: 'admin',
          provider: 'demo',
          lastLoginAt: new Date().toISOString(),
        }
      : isVipTarget
      ? {
          uid: 'demo_vip_partner_uid',
          email: 'vip.partner@kietfolio.com',
          displayName: 'Đối Tác Doanh Nghiệp VIP',
          photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=VipPartner',
          role: 'vip',
          provider: 'demo',
          lastLoginAt: new Date().toISOString(),
        }
      : {
          uid: 'demo_visitor_recruiter_uid',
          email: 'partner.recruiter@example.com',
          displayName: 'Khách Tham Quan (Member)',
          photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=GuestVisitor',
          role: 'member',
          provider: 'demo',
          lastLoginAt: new Date().toISOString(),
        }

    setUser(demoUser)
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoUser))
    setIsAuthModalOpen(false)
    triggerCelebratoryWhale()
  }, [])

  // 4. Sign In with Google (Verified Google OAuth & Personal Gmail)
  const signInWithGoogle = useCallback(
    async (customEmail?: string, customDisplayName?: string) => {
      setError(null)
      setIsLoading(true)

      // 1. If personal Gmail/Email is provided directly
      if (customEmail && customEmail.trim()) {
        const trimmedEmail = customEmail.trim().toLowerCase()
        if (!trimmedEmail.includes('@')) {
          setError('Vui lòng nhập địa chỉ Gmail/Email hợp lệ.')
          setIsLoading(false)
          return
        }

        const isAdminEmail = ADMIN_AUTHORIZED_EMAILS.includes(trimmedEmail)
        const finalName = customDisplayName?.trim() || trimmedEmail.split('@')[0]

        const googleUser: AuthUser = {
          uid: `google_${Date.now()}_${trimmedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          email: trimmedEmail,
          displayName: isAdminEmail ? 'Mai Anh Kiệt (Quản trị viên)' : finalName,
          photoURL: isAdminEmail
            ? 'https://api.dicebear.com/7.x/bottts/svg?seed=Kietteve'
            : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`,
          role: isAdminEmail ? 'admin' : 'member',
          provider: 'google',
          lastLoginAt: new Date().toISOString(),
        }

        setUser(googleUser)
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(googleUser))

        // Record in local user database
        try {
          const storedUsers: UserRecord[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]')
          const existingIdx = storedUsers.findIndex((u) => u.email === trimmedEmail)
          const userRec: UserRecord = {
            uid: googleUser.uid,
            name: googleUser.displayName || trimmedEmail.split('@')[0],
            email: trimmedEmail,
            passwordHash: '',
            avatarUrl: googleUser.photoURL || undefined,
            role: googleUser.role,
            provider: 'google',
            createdAt: new Date().toISOString(),
          }
          if (existingIdx >= 0) {
            storedUsers[existingIdx] = userRec
          } else {
            storedUsers.push(userRec)
          }
          localStorage.setItem(USERS_DB_KEY, JSON.stringify(storedUsers))
        } catch {}

        // Sync with backend API
        fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: googleUser.uid,
            email: googleUser.email,
            displayName: googleUser.displayName,
            photoURL: googleUser.photoURL,
          }),
        }).catch(() => {})

        setIsAuthModalOpen(false)
        setIsLoading(false)
        triggerCelebratoryWhale()
        return
      }

      // 2. If Firebase is genuinely configured with real keys, try official popup
      if (auth && googleProvider && isFirebaseReady) {
        try {
          const result = await signInWithPopup(auth, googleProvider)
          const mapped = mapFirebaseUser(result.user)
          setUser(mapped)
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mapped))

          fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
            }),
          }).catch(() => {})

          setIsAuthModalOpen(false)
          setIsLoading(false)
          triggerCelebratoryWhale()
          return
        } catch (err: unknown) {
          const errCode = (err as { code?: string })?.code || ''
          const rawMsg = err instanceof Error ? err.message : ''

          if (errCode === 'auth/popup-closed-by-user' || rawMsg.includes('popup-closed-by-user')) {
            setError(null)
            setIsLoading(false)
            return
          }
          // Popup failed, fallback to Gmail input tab
        }
      }

      // 3. Fallback: switch to personal Gmail input tab so the user can enter their personal Gmail
      setIsLoading(false)
      setAuthModalMode('gmail')
    },
    [isFirebaseReady]
  )

  // 5. Direct Custom Gmail Sign In (Safe fallback: never grants Admin)
  const signInWithCustomGmail = useCallback((email: string, displayName?: string) => {
    setError(null)
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ Gmail hợp lệ (ví dụ: yourname@gmail.com)')
      return
    }

    // SECURITY: Prevent unauthorized impersonation of Kiệt's admin account
    if (ADMIN_AUTHORIZED_EMAILS.includes(trimmedEmail)) {
      setError('Đây là tài khoản Quản trị viên của Kiệt. Vui lòng chuyển sang tab Đăng nhập và nhập mật khẩu!')
      return
    }

    const finalName = displayName?.trim() || trimmedEmail.split('@')[0]

    const customUser: AuthUser = {
      uid: `gmail_${Date.now()}_${trimmedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: trimmedEmail,
      displayName: finalName,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`,
      role: 'member',
      provider: 'google',
      lastLoginAt: new Date().toISOString(),
    }

    // Save to user storage
    try {
      const storedUsers: UserRecord[] = JSON.parse(
        localStorage.getItem(USERS_DB_KEY) || '[]'
      )
      if (!storedUsers.some((u) => u.email === trimmedEmail)) {
        storedUsers.push({
          uid: customUser.uid,
          name: finalName,
          email: trimmedEmail,
          passwordHash: '',
          avatarUrl: customUser.photoURL || undefined,
          role: 'member',
          provider: 'google',
          createdAt: new Date().toISOString(),
        })
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(storedUsers))
      }
    } catch {
      // ignore
    }

    setUser(customUser)
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(customUser))
    setIsAuthModalOpen(false)
    triggerCelebratoryWhale()
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
      localStorage.removeItem(JWT_TOKEN_KEY)
      setUser(null)
      setIsAdminModalOpen(false)
      setIsVipModalOpen(false)
      setIsLoading(false)
    }
  }, [user])

  const isAdmin = useMemo(() => {
    return Boolean(
      user &&
      user.role === 'admin' &&
      user.email &&
      ADMIN_AUTHORIZED_EMAILS.includes(user.email.toLowerCase())
    )
  }, [user])

  const isVip = useMemo(() => {
    return Boolean(user && (user.role === 'vip' || isAdmin))
  }, [user, isAdmin])

  const isMember = useMemo(() => {
    return Boolean(user)
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

  const openAdminModal = useCallback(() => {
    setIsAdminModalOpen(true)
    if (!isAdmin) {
      setError('Yêu cầu quyền Quản trị viên: Chỉ tài khoản Admin được phân quyền mới có thể truy cập khu vực này!')
    }
  }, [isAdmin])

  const closeAdminModal = useCallback(() => setIsAdminModalOpen(false), [])

  const openVipModal = useCallback(() => {
    setError(null)
    setIsVipModalOpen(true)
  }, [])

  const closeVipModal = useCallback(() => {
    setIsVipModalOpen(false)
    setError(null)
  }, [])

  const upgradeToVip = useCallback(
    async (plan: string = 'lifetime'): Promise<boolean> => {
      if (!user) {
        openAuthModal('signin')
        return false
      }

      const expiresAt =
        plan === 'monthly'
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null

      const updatedUser: AuthUser = {
        ...user,
        role: user.role === 'admin' ? 'admin' : 'vip',
        vipExpiresAt: expiresAt,
      }

      setUser(updatedUser)
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser))

      try {
        const existingRaw = localStorage.getItem(USERS_DB_KEY)
        const userList: UserRecord[] = existingRaw ? JSON.parse(existingRaw) : []
        const index = userList.findIndex(
          (u) =>
            u.uid === user.uid ||
            (user.email && u.email.toLowerCase() === user.email.toLowerCase())
        )
        if (index !== -1) {
          userList[index].role = user.role === 'admin' ? 'admin' : 'vip'
          userList[index].vipExpiresAt = expiresAt
          localStorage.setItem(USERS_DB_KEY, JSON.stringify(userList))
        }
      } catch {
        // Ignore localStorage parse errors
      }

      triggerCelebratoryWhale()
      setIsVipModalOpen(false)
      return true
    },
    [user, openAuthModal]
  )

  const updateUserRoleByAdmin = useCallback(
    async (targetUid: string, newRole: UserRole): Promise<boolean> => {
      if (!isAdmin) {
        setError('Chỉ Quản trị viên (Admin) mới có thẩm quyền phân quyền người dùng!')
        return false
      }

      try {
        const existingRaw = localStorage.getItem(USERS_DB_KEY)
        const userList: UserRecord[] = existingRaw ? JSON.parse(existingRaw) : []
        const index = userList.findIndex((u) => u.uid === targetUid)
        if (index !== -1) {
          userList[index].role = newRole
          localStorage.setItem(USERS_DB_KEY, JSON.stringify(userList))
        }

        if (user && user.uid === targetUid) {
          const updatedSession: AuthUser = { ...user, role: newRole }
          setUser(updatedSession)
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession))
        }
        return true
      } catch {
        return false
      }
    },
    [isAdmin, user]
  )

  const clearError = useCallback(() => setError(null), [])

  const contextValue = useMemo(
    () => ({
      user,
      isAdmin,
      isVip,
      isMember,
      isLoading,
      error,
      isFirebaseReady,
      isAuthModalOpen,
      authModalMode,
      isAdminModalOpen,
      isVipModalOpen,
      openAuthModal,
      closeAuthModal,
      openAdminModal,
      closeAdminModal,
      openVipModal,
      closeVipModal,
      upgradeToVip,
      updateUserRoleByAdmin,
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
      isVip,
      isMember,
      isLoading,
      error,
      isFirebaseReady,
      isAuthModalOpen,
      authModalMode,
      isAdminModalOpen,
      isVipModalOpen,
      openAuthModal,
      closeAuthModal,
      openAdminModal,
      closeAdminModal,
      openVipModal,
      closeVipModal,
      upgradeToVip,
      updateUserRoleByAdmin,
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
