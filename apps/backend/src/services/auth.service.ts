import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db/pool'
import { config } from '../config/env'
import { UserPayload } from '../types'

// Resilient in-memory store if DB is offline
const memoryUsers = new Map<string, {
  uid: string
  email: string
  passwordHash: string
  displayName: string
  photoURL?: string
  role: 'super_admin' | 'admin' | 'vip' | 'user' | string
  status: 'active' | 'suspended' | 'pending' | string
  provider: 'password' | 'google'
  vipExpiresAt?: string | null
}>()

export class AuthService {
  private static determineRole(email: string): 'super_admin' | 'admin' | 'user' {
    const normalized = email.toLowerCase().trim()
    if (normalized === config.admin.email) {
      return 'super_admin'
    }
    const adminEmails = config.admin.additionalEmails.map((e) => e.toLowerCase().trim())
    if (adminEmails.includes(normalized)) {
      return 'admin'
    }
    return 'user'
  }

  public static generateToken(payload: UserPayload): string {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' })
  }

  private static checkVipExpiry(role: string, vipExpiresAt?: string | Date | null): { role: string; vipExpiresAt: string | null } {
    if (role !== 'vip') {
      return { role, vipExpiresAt: null }
    }
    if (!vipExpiresAt) {
      // Lifetime VIP
      return { role: 'vip', vipExpiresAt: null }
    }

    const expiryDate = new Date(vipExpiresAt)
    if (expiryDate.getTime() < Date.now()) {
      // VIP has expired, demote to regular user
      return { role: 'user', vipExpiresAt: null }
    }

    return { role: 'vip', vipExpiresAt: expiryDate.toISOString() }
  }

  public static async registerWithEmail(
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ user: UserPayload; token: string }> {
    const normalizedEmail = email.toLowerCase().trim()
    const passwordHash = await bcrypt.hash(password, 10)
    const role = this.determineRole(normalizedEmail)
    const name = displayName?.trim() || normalizedEmail.split('@')[0]
    const uid = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

    try {
      const res = await pool.query(
        `INSERT INTO users (id, email, password_hash, display_name, role, status, provider, vip_expires_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 'active', 'password', NULL, NOW(), NOW())
         RETURNING id, email, display_name, photo_url, role, status, provider, vip_expires_at`,
        [uid, normalizedEmail, passwordHash, name, role]
      )

      const row = res.rows[0]
      const user: UserPayload = {
        uid: row.id,
        email: row.email,
        displayName: row.display_name,
        photoURL: row.photo_url,
        role: row.role,
        status: row.status,
        provider: row.provider,
        vipExpiresAt: row.vip_expires_at ? new Date(row.vip_expires_at).toISOString() : null,
      }
      return { user, token: this.generateToken(user) }
    } catch (err: unknown) {
      const pgErr = err as { code?: string; message?: string }
      if (
        pgErr?.code === '23505' ||
        pgErr?.message?.includes('duplicate key') ||
        pgErr?.message?.includes('users_email_key')
      ) {
        throw new Error('Email này đã được đăng ký tài khoản. Vui lòng chuyển sang Đăng nhập!')
      }

      // Fallback to memory store if PostgreSQL is temporarily initializing
      if (memoryUsers.has(normalizedEmail)) {
        throw new Error('Email này đã được đăng ký tài khoản. Vui lòng chuyển sang Đăng nhập!')
      }

      const userRecord = {
        uid,
        email: normalizedEmail,
        passwordHash,
        displayName: name,
        role,
        status: 'active',
        provider: 'password' as const,
        vipExpiresAt: null,
      }
      memoryUsers.set(normalizedEmail, userRecord)

      const user: UserPayload = {
        uid,
        email: normalizedEmail,
        displayName: name,
        role,
        status: 'active',
        provider: 'password',
        vipExpiresAt: null,
      }
      return { user, token: this.generateToken(user) }
    }
  }

  public static async loginWithEmail(
    email: string,
    password: string
  ): Promise<{ user: UserPayload; token: string }> {
    const normalizedEmail = email.toLowerCase().trim()

    try {
      const res = await pool.query(
        `SELECT id, email, password_hash, display_name, photo_url, role, status, provider, vip_expires_at
         FROM users WHERE email = $1`,
        [normalizedEmail]
      )

      if (res.rows.length === 0) {
        throw new Error('Email hoặc mật khẩu chưa chính xác. Vui lòng kiểm tra lại!')
      }

      const row = res.rows[0]
      if (row.status === 'suspended') {
        throw new Error('Tài khoản này đã bị tạm khóa do vi phạm chính sách.')
      }

      if (!row.password_hash) {
        throw new Error('Tài khoản này được đăng ký qua Google. Vui lòng đăng nhập bằng Google!')
      }

      const isValid = await bcrypt.compare(password, row.password_hash)
      if (!isValid) {
        throw new Error('Email hoặc mật khẩu chưa chính xác. Vui lòng kiểm tra lại!')
      }

      // Check VIP status & expiration
      const { role: effectiveRole, vipExpiresAt } = this.checkVipExpiry(row.role, row.vip_expires_at)

      // If VIP expired, demote in database asynchronously
      if (row.role === 'vip' && effectiveRole === 'user') {
        pool.query(`UPDATE users SET role = 'user', vip_expires_at = NULL WHERE id = $1`, [row.id]).catch(() => {})
      }

      const user: UserPayload = {
        uid: row.id,
        email: row.email,
        displayName: row.display_name,
        photoURL: row.photo_url,
        role: effectiveRole,
        status: row.status,
        provider: row.provider,
        vipExpiresAt,
      }

      return { user, token: this.generateToken(user) }
    } catch (err) {
      if (
        err instanceof Error &&
        (err.message.includes('chưa chính xác') || err.message.includes('Google') || err.message.includes('khóa'))
      ) {
        throw err
      }

      // Check memory store fallback
      const memUser = memoryUsers.get(normalizedEmail)
      if (memUser) {
        if (memUser.status === 'suspended') {
          throw new Error('Tài khoản này đã bị tạm khóa do vi phạm chính sách.')
        }
        const isValid = await bcrypt.compare(password, memUser.passwordHash)
        if (isValid) {
          const { role: effectiveRole, vipExpiresAt } = this.checkVipExpiry(memUser.role, memUser.vipExpiresAt)
          const user: UserPayload = {
            uid: memUser.uid,
            email: memUser.email,
            displayName: memUser.displayName,
            photoURL: memUser.photoURL,
            role: effectiveRole,
            status: memUser.status,
            provider: memUser.provider,
            vipExpiresAt,
          }
          return { user, token: this.generateToken(user) }
        }
      }
      throw new Error('Email hoặc mật khẩu chưa chính xác. Vui lòng kiểm tra lại!')
    }
  }

  public static async googleAuth(googleUser: {
    uid: string
    email: string
    displayName?: string
    photoURL?: string
  }): Promise<{ user: UserPayload; token: string }> {
    const normalizedEmail = googleUser.email.toLowerCase().trim()
    const role = this.determineRole(normalizedEmail)

    try {
      const res = await pool.query(
        `INSERT INTO users (id, email, display_name, photo_url, role, status, provider, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 'active', 'google', NOW(), NOW())
         ON CONFLICT (email) DO UPDATE
         SET display_name = COALESCE(EXCLUDED.display_name, users.display_name),
             photo_url = COALESCE(EXCLUDED.photo_url, users.photo_url),
             updated_at = NOW()
         RETURNING id, email, display_name, photo_url, role, status, provider, vip_expires_at`,
        [googleUser.uid, normalizedEmail, googleUser.displayName || '', googleUser.photoURL || '', role]
      )

      const row = res.rows[0]
      const { role: effectiveRole, vipExpiresAt } = this.checkVipExpiry(row.role, row.vip_expires_at)

      const user: UserPayload = {
        uid: row.id,
        email: row.email,
        displayName: row.display_name,
        photoURL: row.photo_url,
        role: effectiveRole,
        status: row.status,
        provider: row.provider,
        vipExpiresAt,
      }
      return { user, token: this.generateToken(user) }
    } catch {
      // Memory fallback
      const user: UserPayload = {
        uid: googleUser.uid,
        email: normalizedEmail,
        displayName: googleUser.displayName,
        photoURL: googleUser.photoURL,
        role,
        status: 'active',
        provider: 'google',
        vipExpiresAt: null,
      }
      return { user, token: this.generateToken(user) }
    }
  }

  /**
   * Upgrade user to VIP (monthly or lifetime) with PostgreSQL persistence
   */
  public static async upgradeToVip(
    userIdOrEmail: string,
    plan: 'monthly' | 'lifetime' = 'lifetime'
  ): Promise<{ user: UserPayload; token: string }> {
    const expiresAt =
      plan === 'monthly'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : null

    try {
      const res = await pool.query(
        `UPDATE users
         SET role = 'vip',
             vip_expires_at = $1,
             updated_at = NOW()
         WHERE (id = $2 OR email = LOWER(TRIM($2))) AND role != 'super_admin' AND role != 'admin'
         RETURNING id, email, display_name, photo_url, role, status, provider, vip_expires_at`,
        [expiresAt, userIdOrEmail]
      )

      if (res.rows.length === 0) {
        // Maybe the user is already admin or not found
        const existingRes = await pool.query(`SELECT id, email, display_name, photo_url, role, status, provider, vip_expires_at FROM users WHERE id = $1 OR email = LOWER(TRIM($1))`, [userIdOrEmail])
        if (existingRes.rows.length === 0) {
          throw new Error('Không tìm thấy tài khoản người dùng để nâng cấp VIP.')
        }
        const row = existingRes.rows[0]
        const user: UserPayload = {
          uid: row.id,
          email: row.email,
          displayName: row.display_name,
          photoURL: row.photo_url,
          role: row.role,
          status: row.status,
          provider: row.provider,
          vipExpiresAt: row.vip_expires_at ? new Date(row.vip_expires_at).toISOString() : null,
        }
        return { user, token: this.generateToken(user) }
      }

      const row = res.rows[0]
      const user: UserPayload = {
        uid: row.id,
        email: row.email,
        displayName: row.display_name,
        photoURL: row.photo_url,
        role: 'vip',
        status: row.status,
        provider: row.provider,
        vipExpiresAt: expiresAt ? expiresAt.toISOString() : null,
      }

      return { user, token: this.generateToken(user) }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('Không tìm thấy')) throw err

      // Memory fallback update
      const targetUser = Array.from(memoryUsers.values()).find(
        (u) => u.uid === userIdOrEmail || u.email === userIdOrEmail.toLowerCase().trim()
      )

      if (targetUser) {
        if (targetUser.role !== 'admin' && targetUser.role !== 'super_admin') {
          targetUser.role = 'vip'
          targetUser.vipExpiresAt = expiresAt ? expiresAt.toISOString() : null
        }
        const user: UserPayload = {
          uid: targetUser.uid,
          email: targetUser.email,
          displayName: targetUser.displayName,
          photoURL: targetUser.photoURL,
          role: targetUser.role,
          status: targetUser.status,
          provider: targetUser.provider,
          vipExpiresAt: targetUser.vipExpiresAt,
        }
        return { user, token: this.generateToken(user) }
      }

      throw new Error('Nâng cấp VIP thất bại. Vui lòng thử lại sau.')
    }
  }

  /**
   * Get user profile by ID or Email with fresh VIP calculation
   */
  public static async getUserByIdOrEmail(identifier: string): Promise<UserPayload | null> {
    try {
      const res = await pool.query(
        `SELECT id, email, display_name, photo_url, role, status, provider, vip_expires_at
         FROM users WHERE id = $1 OR email = LOWER(TRIM($1))`,
        [identifier]
      )
      if (res.rows.length === 0) return null

      const row = res.rows[0]
      const { role, vipExpiresAt } = this.checkVipExpiry(row.role, row.vip_expires_at)

      return {
        uid: row.id,
        email: row.email,
        displayName: row.display_name,
        photoURL: row.photo_url,
        role,
        status: row.status,
        provider: row.provider,
        vipExpiresAt,
      }
    } catch {
      const memUser = Array.from(memoryUsers.values()).find(
        (u) => u.uid === identifier || u.email === identifier.toLowerCase().trim()
      )
      if (!memUser) return null
      const { role, vipExpiresAt } = this.checkVipExpiry(memUser.role, memUser.vipExpiresAt)
      return {
        uid: memUser.uid,
        email: memUser.email,
        displayName: memUser.displayName,
        photoURL: memUser.photoURL,
        role,
        status: memUser.status,
        provider: memUser.provider,
        vipExpiresAt,
      }
    }
  }

  public static async getAllUsers(): Promise<Array<{
    uid: string
    email: string
    displayName: string
    photoURL?: string
    role: string
    status: string
    provider: string
    vipExpiresAt?: string | null
    createdAt?: string
  }>> {
    try {
      const res = await pool.query(
        `SELECT id, email, display_name, photo_url, role, status, provider, vip_expires_at, created_at
         FROM users
         ORDER BY created_at DESC`
      )
      return res.rows.map((row) => {
        const { role, vipExpiresAt } = this.checkVipExpiry(row.role, row.vip_expires_at)
        return {
          uid: row.id,
          email: row.email,
          displayName: row.display_name,
          photoURL: row.photo_url,
          role,
          status: row.status,
          provider: row.provider,
          vipExpiresAt,
          createdAt: row.created_at,
        }
      })
    } catch {
      return Array.from(memoryUsers.values()).map((u) => {
        const { role, vipExpiresAt } = this.checkVipExpiry(u.role, u.vipExpiresAt)
        return {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          role,
          status: u.status,
          provider: u.provider,
          vipExpiresAt,
        }
      })
    }
  }
}
