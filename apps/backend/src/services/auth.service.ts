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
  role: 'admin' | 'user'
  provider: 'password' | 'google'
}>()

export class AuthService {
  private static determineRole(email: string): 'admin' | 'user' {
    const adminEmails = [
      config.admin.email.toLowerCase(),
      'kietteve22102005@gmail.com',
      'kiet.maianh@gmail.com',
    ]
    return adminEmails.includes(email.toLowerCase().trim()) ? 'admin' : 'user'
  }

  public static generateToken(payload: UserPayload): string {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' })
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
        `INSERT INTO users (id, email, password_hash, display_name, role, provider, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 'password', NOW(), NOW())
         RETURNING id, email, display_name, role, provider`,
        [uid, normalizedEmail, passwordHash, name, role]
      )

      const row = res.rows[0]
      const user: UserPayload = {
        uid: row.id,
        email: row.email,
        displayName: row.display_name,
        role: row.role,
        provider: row.provider,
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
        provider: 'password' as const,
      }
      memoryUsers.set(normalizedEmail, userRecord)

      const user: UserPayload = {
        uid,
        email: normalizedEmail,
        displayName: name,
        role,
        provider: 'password',
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
        `SELECT id, email, password_hash, display_name, photo_url, role, provider
         FROM users WHERE email = $1`,
        [normalizedEmail]
      )

      if (res.rows.length === 0) {
        throw new Error('Email hoặc mật khẩu chưa chính xác. Vui lòng kiểm tra lại!')
      }

      const row = res.rows[0]
      if (!row.password_hash) {
        throw new Error('Tài khoản này được đăng ký qua Google. Vui lòng đăng nhập bằng Google!')
      }

      const isValid = await bcrypt.compare(password, row.password_hash)
      if (!isValid) {
        throw new Error('Email hoặc mật khẩu chưa chính xác. Vui lòng kiểm tra lại!')
      }

      const user: UserPayload = {
        uid: row.id,
        email: row.email,
        displayName: row.display_name,
        photoURL: row.photo_url,
        role: row.role,
        provider: row.provider,
      }

      return { user, token: this.generateToken(user) }
    } catch (err) {
      if (
        err instanceof Error &&
        (err.message.includes('chưa chính xác') || err.message.includes('Google'))
      ) {
        throw err
      }

      // Check memory store fallback
      const memUser = memoryUsers.get(normalizedEmail)
      if (memUser) {
        const isValid = await bcrypt.compare(password, memUser.passwordHash)
        if (isValid) {
          const user: UserPayload = {
            uid: memUser.uid,
            email: memUser.email,
            displayName: memUser.displayName,
            photoURL: memUser.photoURL,
            role: memUser.role,
            provider: memUser.provider,
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
        `INSERT INTO users (id, email, display_name, photo_url, role, provider, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 'google', NOW(), NOW())
         ON CONFLICT (email) DO UPDATE
         SET display_name = COALESCE(EXCLUDED.display_name, users.display_name),
             photo_url = COALESCE(EXCLUDED.photo_url, users.photo_url),
             updated_at = NOW()
         RETURNING id, email, display_name, photo_url, role, provider`,
        [googleUser.uid, normalizedEmail, googleUser.displayName || '', googleUser.photoURL || '', role]
      )

      const row = res.rows[0]
      const user: UserPayload = {
        uid: row.id,
        email: row.email,
        displayName: row.display_name,
        photoURL: row.photo_url,
        role: row.role,
        provider: row.provider,
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
        provider: 'google',
      }
      return { user, token: this.generateToken(user) }
    }
  }

  public static async getAllUsers(): Promise<Array<{
    uid: string
    email: string
    displayName: string
    photoURL?: string
    role: string
    provider: string
    createdAt?: string
  }>> {
    try {
      const res = await pool.query(
        `SELECT id, email, display_name, photo_url, role, provider, created_at
         FROM users
         ORDER BY created_at DESC`
      )
      return res.rows.map((row) => ({
        uid: row.id,
        email: row.email,
        displayName: row.display_name,
        photoURL: row.photo_url,
        role: row.role,
        provider: row.provider,
        createdAt: row.created_at,
      }))
    } catch {
      return Array.from(memoryUsers.values()).map((u) => ({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
        role: u.role,
        provider: u.provider,
      }))
    }
  }
}

