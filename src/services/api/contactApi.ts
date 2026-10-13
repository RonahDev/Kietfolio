import { apiClient } from './apiClient'
import { SITE_CONFIG } from '../../config/site'
import type { ContactFormData } from '../../types'
import type { ContactMessage } from '../../types/auth'

export const contactApi = {
  /**
   * Submit a contact message through remote API or store in local inbox
   */
  async sendMessage(
    formData: ContactFormData,
    userUid?: string
  ): Promise<{ success: boolean; id: string }> {
    const messageId = `msg-${Date.now()}`
    const record: ContactMessage = {
      id: messageId,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      timestamp: new Date().toISOString(),
      isVerifiedUser: Boolean(userUid),
      read: false,
    }

    if (apiClient.isRemoteEnabled) {
      try {
        const res = await apiClient.post<{ id: string }>('contact', record)
        return { success: true, id: res.data.id || messageId }
      } catch (err) {
        console.warn('Remote contact submission failed, saving locally:', err)
      }
    }

    // Local inbox backup
    try {
      const stored = JSON.parse(
        localStorage.getItem(SITE_CONFIG.storageKeys.inbox) || '[]'
      )
      stored.unshift(record)
      localStorage.setItem(
        SITE_CONFIG.storageKeys.inbox,
        JSON.stringify(stored)
      )
    } catch {
      // Ignore write errors
    }

    return { success: true, id: messageId }
  },

  /**
   * Get all messages in inbox (for Admin)
   */
  async getInboxMessages(): Promise<ContactMessage[]> {
    if (apiClient.isRemoteEnabled) {
      try {
        const res = await apiClient.get<ContactMessage[]>('contact')
        return res.data
      } catch (err) {
        console.warn('Failed to fetch remote messages, loading local inbox:', err)
      }
    }

    try {
      return JSON.parse(
        localStorage.getItem(SITE_CONFIG.storageKeys.inbox) || '[]'
      )
    } catch {
      return []
    }
  },
}
