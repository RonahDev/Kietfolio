import { SITE_CONFIG } from '@/config/site'

export interface CreatePaymentPayload {
  amount: number
  donorName: string
  donorMessage?: string
  orderType?: 'coffee' | 'mentorship' | 'custom'
  bankCode?: string
  language?: 'vn' | 'en'
}

export interface PaymentVerificationResult {
  isValid: boolean
  isSuccess: boolean
  orderId: string
  amount: number
  responseCode: string
  transactionNo?: string
  bankCode?: string
  message: string
}

export interface SupporterRecord {
  id: string
  orderId: string
  donorName: string
  donorMessage?: string
  amount: number
  orderType: string
  status: string
  createdAt: string
}

export const paymentApi = {
  /**
   * Generates a signed VNPay QR payment URL from backend
   */
  async createPaymentUrl(payload: CreatePaymentPayload): Promise<{ paymentUrl: string; orderId: string }> {
    const baseUrl = (SITE_CONFIG.apiBaseUrl || '/api').replace(/\/$/, '')
    const response = await fetch(`${baseUrl}/payment/vnpay/create-payment-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error || `HTTP ${response.status}: Failed to generate VNPay QR payment URL`)
    }

    const json = await response.json()
    return json.data
  },

  /**
   * Verifies payment result when redirected back from VNPay
   */
  async verifyPayment(queryParams: Record<string, string>): Promise<PaymentVerificationResult> {
    const baseUrl = (SITE_CONFIG.apiBaseUrl || '/api').replace(/\/$/, '')
    const search = new URLSearchParams(queryParams).toString()
    const response = await fetch(`${baseUrl}/payment/vnpay/vnpay-return?${search}`)

    if (!response.ok) {
      throw new Error('Failed to verify VNPay transaction status')
    }

    const json = await response.json()
    return json.data
  },

  /**
   * Fetches recent successful supporters
   */
  async getRecentSupporters(): Promise<SupporterRecord[]> {
    try {
      const baseUrl = (SITE_CONFIG.apiBaseUrl || '/api').replace(/\/$/, '')
      const response = await fetch(`${baseUrl}/payment/recent`)
      if (!response.ok) return []
      const json = await response.json()
      return json.data || []
    } catch {
      return []
    }
  },
}

