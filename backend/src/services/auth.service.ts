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
    return email.toLowerCase() === config.admin.email ? 'admin' : 'user'
  }

  public static generateToken(payload: UserPayload): string {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' })
  }

  public static async registerWithEmail(
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ user: UserPayload; token: string }> {
    const normalizedEmail = email.toLowerCase()
    const passwordHash = await bcrypt.hash(password, 10)
    const role = this.determineRole(normalizedEmail)
    const name = displayName || normalizedEmail.split('@')[0]
    const uid = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

    try {
      const res = await pool.query(
        `INSERT INTO users (id, email, password_hash, display_name, role, provider, created_at)
         VALUES ($1, $2, $3, $4, $5, 'password', NOW())
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
    } catch {
      // Fallback to memory store if PostgreSQL is initializing
      if (memoryUsers.has(normalizedEmail)) {
        throw new Error('User with this email already exists')
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
    const normalizedEmail = email.toLowerCase()

    try {
      const res = await pool.query(
        `SELECT id, email, password_hash, display_name, photo_url, role, provider
         FROM users WHERE email = $1`,
        [normalizedEmail]
      )

      if (res.rows.length === 0) {
        throw new Error('Invalid email or password')
      }

      const row = res.rows[0]
      const isValid = await bcrypt.compare(password, row.password_hash)
      if (!isValid) {
        throw new Error('Invalid email or password')
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
      throw err instanceof Error ? err : new Error('Login failed')
    }
  }

  public static async googleAuth(googleUser: {
    uid: string
    email: string
    displayName?: string
    photoURL?: string
  }): Promise<{ user: UserPayload; token: string }> {
    const normalizedEmail = googleUser.email.toLowerCase()
    const role = this.determineRole(normalizedEmail)

    try {
      const res = await pool.query(
        `INSERT INTO users (id, email, display_name, photo_url, role, provider, created_at)
         VALUES ($1, $2, $3, $4, $5, 'google', NOW())
         ON CONFLICT (email) DO UPDATE
         SET display_name = EXCLUDED.display_name, photo_url = EXCLUDED.photo_url
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
}
