import { createContext } from 'react'
import type { AuthUser } from '../types/auth'

export type AuthModalMode = 'signin' | 'signup'

export interface AuthContextType {
  user: AuthUser | null
  isAdmin: boolean
  isMember: boolean
  isLoading: boolean
  error: string | null
  isFirebaseReady: boolean
  isAuthModalOpen: boolean
  authModalMode: AuthModalMode
  isAdminModalOpen: boolean
  openAuthModal: (mode?: AuthModalMode) => void
  closeAuthModal: () => void
  openAdminModal: () => void
  closeAdminModal: () => void
  registerWithEmail: (name: string, email: string, password: string) => Promise<boolean>
  signInWithEmail: (email: string, password: string) => Promise<boolean>
  signInWithGoogle: () => Promise<void>
  signInWithCustomGmail: (email: string, displayName?: string) => void
  signInDemo: (asAdmin?: boolean) => void
  signOutUser: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
