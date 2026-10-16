import crypto from 'crypto'
import { config } from '../config/env'
import { pool } from '../db/pool'
import { CreatePaymentUrlPayload, PaymentRecord } from '../types'

let memoryPayments: PaymentRecord[] = [
  {
    id: 'pay-seed-1',
    orderId: 'kietfolio_sample_01',
    donorName: 'Anonymous Supporter',
    donorMessage: 'Keep up the incredible engineering and 3D work!',
    amount: 50000,
    orderType: 'coffee',
    status: 'success',
    vnpTransactionNo: '14201021',
    bankCode: 'VNPAYQR',
    responseCode: '00',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

function sortObject(obj: Record<string, string | number>): Record<string, string> {
  const sorted: Record<string, string> = {}
  const keys = Object.keys(obj).sort()

  for (const key of keys) {
    if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
      // Encode URI components per VNPay specification
      sorted[encodeURIComponent(key)] = encodeURIComponent(String(obj[key])).replace(/%20/g, '+')
    }
  }
  return sorted
}

function formatDateToVnpay(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const yyyy = date.getFullYear()
  const MM = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const HH = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`
}

export class VnpayService {
  /**
   * Generates a signed VNPay QR payment URL
   */
  public static async createPaymentUrl(
    payload: CreatePaymentUrlPayload,
    clientIp: string,
    userUid?: string
  ): Promise<{ paymentUrl: string; orderId: string }> {
    const orderId = `kiet_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    const now = new Date()
    const createDate = formatDateToVnpay(now)

    // Clean IP address
    const ip = clientIp.includes('::1') || clientIp.includes('127.0.0.1') ? '127.0.0.1' : clientIp

    // Construct order description
    const orderDesc = payload.orderType === 'mentorship'
      ? `Dat lich tu van Mentorship 1-1: ${payload.donorName}`
      : `Ung ho Kietfolio: ${payload.donorName}`

    // VNPay expects amount multiplied by 100
    const vnpAmount = Math.round(payload.amount * 100)

    const vnpParams: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: config.vnpay.tmnCode,
      vnp_Locale: payload.language || 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDesc,
      vnp_OrderType: 'other',
      vnp_Amount: vnpAmount,
      vnp_ReturnUrl: config.vnpay.returnUrl,
      vnp_IpAddr: ip,
      vnp_CreateDate: createDate,
    }

    if (payload.bankCode && payload.bankCode.trim() !== '') {
      vnpParams.vnp_BankCode = payload.bankCode
    }

    const sortedParams = sortObject(vnpParams)
    const signData = Object.entries(sortedParams)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')

    const hmac = crypto.createHmac('sha512', config.vnpay.hashSecret)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    const paymentUrl = `${config.vnpay.url}?${signData}&vnp_SecureHash=${signed}`

    // Save transaction state
    const paymentRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      orderId,
      userUid,
      donorName: payload.donorName,
      donorMessage: payload.donorMessage || '',
      amount: payload.amount,
      orderType: payload.orderType || 'coffee',
      status: 'pending',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }

    try {
      await pool.query(
        `INSERT INTO payments (id, order_id, user_uid, donor_name, donor_message, amount, order_type, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          paymentRecord.id,
          paymentRecord.orderId,
          paymentRecord.userUid || null,
          paymentRecord.donorName,
          paymentRecord.donorMessage,
          paymentRecord.amount,
          paymentRecord.orderType,
          paymentRecord.status,
          paymentRecord.createdAt,
          paymentRecord.updatedAt,
        ]
      )
    } catch {
      // Memory fallback
    }

    memoryPayments = [paymentRecord, ...memoryPayments]

    return { paymentUrl, orderId }
  }

  /**
   * Verifies the cryptographic hash returned by VNPay and updates database record
   */
  public static async verifyReturn(
    queryParams: Record<string, string>
  ): Promise<{
    isValid: boolean
    isSuccess: boolean
    orderId: string
    amount: number
    responseCode: string
    transactionNo?: string
    bankCode?: string
    message: string
  }> {
    const secureHash = queryParams.vnp_SecureHash
    const paramsToVerify = { ...queryParams }

    delete paramsToVerify.vnp_SecureHash
    delete paramsToVerify.vnp_SecureHashType

    const sortedParams = sortObject(paramsToVerify)
    const signData = Object.entries(sortedParams)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')

    const hmac = crypto.createHmac('sha512', config.vnpay.hashSecret)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    const isValid = signed === secureHash
    const orderId = queryParams.vnp_TxnRef || ''
    const responseCode = queryParams.vnp_ResponseCode || ''
    const transactionNo = queryParams.vnp_TransactionNo || ''
    const bankCode = queryParams.vnp_BankCode || ''
    const amount = parseInt(queryParams.vnp_Amount || '0', 10) / 100
    const isSuccess = isValid && responseCode === '00'

    const status: 'success' | 'failed' = isSuccess ? 'success' : 'failed'

    try {
      await pool.query(
        `UPDATE payments 
         SET status = $1, vnp_transaction_no = $2, bank_code = $3, response_code = $4, updated_at = NOW()
         WHERE order_id = $5`,
        [status, transactionNo, bankCode, responseCode, orderId]
      )
    } catch {
      // Memory fallback
    }

    const memTarget = memoryPayments.find((p) => p.orderId === orderId)
    if (memTarget) {
      memTarget.status = status
      memTarget.vnpTransactionNo = transactionNo
      memTarget.bankCode = bankCode
      memTarget.responseCode = responseCode
      memTarget.updatedAt = new Date().toISOString()
    }

    let message = 'Giao dịch không hợp lệ'
    if (isValid) {
      message = isSuccess ? 'Giao dịch thành công' : 'Giao dịch thất bại hoặc bị hủy'
    }

    return {
      isValid,
      isSuccess,
      orderId,
      amount,
      responseCode,
      transactionNo,
      bankCode,
      message,
    }
  }

  /**
   * Retrieves recent successful contributions to showcase on the site
   */
  public static async getRecentContributions(): Promise<PaymentRecord[]> {
    try {
      const res = await pool.query(
        `SELECT id, order_id as "orderId", donor_name as "donorName", donor_message as "donorMessage", 
                amount, order_type as "orderType", status, created_at as "createdAt"
         FROM payments
         WHERE status = 'success'
         ORDER BY created_at DESC
         LIMIT 20`
      )
      if (res.rows.length > 0) {
        return res.rows
      }
      return memoryPayments.filter((p) => p.status === 'success')
    } catch {
      return memoryPayments.filter((p) => p.status === 'success')
    }
  }
}

