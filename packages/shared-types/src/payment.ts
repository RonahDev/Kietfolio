export type DonationTier = 20000 | 50000 | 100000 | 200000 | 'custom'

export type PaymentOrderType = 'coffee' | 'mentorship' | 'custom'

export type PaymentStatus = 'pending' | 'success' | 'failed'

export interface PaymentRecord {
  id: string
  orderId: string
  userUid?: string
  donorName: string
  donorMessage?: string
  amount: number
  orderType: PaymentOrderType
  status: PaymentStatus
  vnpTransactionNo?: string
  bankCode?: string
  responseCode?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentUrlPayload {
  amount: number
  donorName: string
  donorMessage?: string
  orderType?: PaymentOrderType
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

