import { SITE_CONFIG } from '@/config/site'

export type VipPlanTier = 'monthly' | 'quarterly' | 'annual' | 'lifetime'

export interface CreatePaymentPayload {
  amount: number
  donorName: string
  donorMessage?: string
  orderType?: 'coffee' | 'mentorship' | 'custom' | 'vip_monthly' | 'vip_quarterly' | 'vip_annual' | 'vip_lifetime' | string
  bankCode?: string
  language?: 'vn' | 'en'
  userUid?: string
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
  orderType?: string
  isVipUpgrade?: boolean
  user?: any
  token?: string
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
    const jwtToken = typeof localStorage !== 'undefined' ? localStorage.getItem(SITE_CONFIG.storageKeys.jwtToken) : null

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (jwtToken) {
      headers.Authorization = `Bearer ${jwtToken}`
    }

    const response = await fetch(`${baseUrl}/payment/vnpay/create-payment-url`, {
      method: 'POST',
      headers,
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
   * Creates a dedicated VIP subscription payment URL via VNPay
   */
  async createVipPaymentUrl(
    plan: VipPlanTier,
    user: { uid?: string; email?: string | null; displayName?: string | null }
  ): Promise<{ paymentUrl: string; orderId: string }> {
    const planPrices: Record<VipPlanTier, number> = {
      monthly: SITE_CONFIG.vip.priceMonthly || 99000,
      quarterly: SITE_CONFIG.vip.priceQuarterly || 249000,
      annual: SITE_CONFIG.vip.priceAnnual || 699000,
      lifetime: SITE_CONFIG.vip.priceLifetime || 499000,
    }

    const amount = planPrices[plan] || 99000
    const donorName = user.displayName || user.email?.split('@')[0] || 'Hội viên VIP'

    return this.createPaymentUrl({
      amount,
      donorName,
      donorMessage: `Nạp VIP (${plan.toUpperCase()}) cho tài khoản ${user.email || ''}`,
      orderType: `vip_${plan}`,
      userUid: user.uid,
      bankCode: 'VNPAYQR',
      language: 'vn',
    })
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

