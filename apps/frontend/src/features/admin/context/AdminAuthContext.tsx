import React, { createContext, useState, useEffect, useCallback } from 'react'
import { adminService } from '../services/adminService'
import type { AdminUser } from '../types/admin'

interface AdminAuthContextValue {
  adminUser: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, pass: string) => Promise<boolean>
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
  refreshProfile: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined)

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Verify server session on boot via HttpOnly cookie
  const refreshProfile = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const user = await adminService.getMe()
      setAdminUser(user)
    } catch {
      setAdminUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      const user = await adminService.login(email, pass)
      setAdminUser(user)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập quản trị thất bại')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      await adminService.logout()
    } catch (err) {
      console.warn('[AdminLogout]: Error on logout call:', err)
    } finally {
      setAdminUser(null)
      setIsLoading(false)
    }
  }

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!adminUser) return false
      if (adminUser.role === 'super_admin') return true
      return adminUser.permissions ? adminUser.permissions.includes(permission) : false
    },
    [adminUser]
  )

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: Boolean(adminUser),
        isLoading,
        error,
        login,
        logout,
        hasPermission,
        refreshProfile,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export { AdminAuthContext }
export type { AdminAuthContextValue }
