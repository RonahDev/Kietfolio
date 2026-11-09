import { createContext } from 'react'
import type { AuthUser, UserRole } from '../types/auth'

export type AuthModalMode = 'signin' | 'signup' | 'gmail'

export interface AuthContextType {
  user: AuthUser | null
  isAdmin: boolean
  isVip: boolean
  isMember: boolean
  isLoading: boolean
  error: string | null
  isFirebaseReady: boolean
  isAuthModalOpen: boolean
  authModalMode: AuthModalMode
  isAdminModalOpen: boolean
  isVipModalOpen: boolean
  openAuthModal: (mode?: AuthModalMode) => void
  closeAuthModal: () => void
  openAdminModal: () => void
  closeAdminModal: () => void
  openVipModal: () => void
  closeVipModal: () => void
  upgradeToVip: (plan?: string) => Promise<boolean>
  updateUserRoleByAdmin: (targetUid: string, newRole: UserRole) => Promise<boolean>
  registerWithEmail: (name: string, email: string, password: string) => Promise<boolean>
  signInWithEmail: (email: string, password: string) => Promise<boolean>
  signInWithGoogle: (customEmail?: string, customDisplayName?: string) => Promise<void>
  signInWithCustomGmail: (email: string, displayName?: string) => void
  signInDemo: (asAdmin?: boolean) => void
  signOutUser: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
