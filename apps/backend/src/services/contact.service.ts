import { pool } from '../db/pool'
import { ContactMessage } from '../types'

let memoryMessages: ContactMessage[] = []

export class ContactService {
  public static async createMessage(data: {
    name: string
    email: string
    subject: string
    message: string
    honeypot?: string
    userUid?: string
  }): Promise<{ success: boolean; id: string }> {
    // Anti-spam honeypot verification
    if (data.honeypot && data.honeypot.trim() !== '') {
      // Silently discard spam bots
      return { success: true, id: `msg-discarded` }
    }

    const id = `msg-${Date.now()}`
    const timestamp = new Date().toISOString()
    const isVerifiedUser = Boolean(data.userUid)

    const record: ContactMessage = {
      id,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      timestamp,
      isVerifiedUser,
      read: false,
    }

    try {
      await pool.query(
        `INSERT INTO contact_messages (id, user_uid, name, email, subject, message, is_verified_user, read, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, false, $8)`,
        [id, data.userUid || null, data.name, data.email, data.subject, data.message, isVerifiedUser, timestamp]
      )
    } catch {
      // Memory fallback
    }

    memoryMessages = [record, ...memoryMessages]
    return { success: true, id }
  }

  public static async getAllMessages(): Promise<ContactMessage[]> {
    try {
      const res = await pool.query(
        `SELECT id, name, email, subject, message, is_verified_user as "isVerifiedUser", read, created_at as timestamp
         FROM contact_messages
         ORDER BY created_at DESC`
      )
      if (res.rows.length > 0) {
        return res.rows
      }
      return memoryMessages
    } catch {
      return memoryMessages
    }
  }

  public static async markAsRead(id: string): Promise<boolean> {
    try {
      await pool.query('UPDATE contact_messages SET read = true WHERE id = $1', [id])
    } catch {
      // Memory fallback
    }
    const target = memoryMessages.find((m) => m.id === id)
    if (target) target.read = true
    return true
  }
}

