import { createContext } from 'react'
import type { AuthUser } from '../types/auth'

export interface AuthContextType {
  user: AuthUser | null
  isAdmin: boolean
  isLoading: boolean
  error: string | null
  isFirebaseReady: boolean
  isAuthModalOpen: boolean
  isAdminModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  openAdminModal: () => void
  closeAdminModal: () => void
  signInWithGoogle: () => Promise<void>
  signInDemo: (asAdmin?: boolean) => void
  signOutUser: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
