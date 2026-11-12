import { Request, Response, NextFunction } from 'express'
import { VnpayService } from '../services/vnpay.service'
import { AuthenticatedRequest } from '../types'

export class PaymentController {
  public static async createPaymentUrl(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount, donorName, donorMessage, orderType, bankCode, language } = req.body

      const rawIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1'
      const clientIp = rawIp.split(',')[0].trim()

      const userUid = req.user?.uid || req.body.userUid || undefined

      const result = await VnpayService.createPaymentUrl(
        {
          amount: Number(amount),
          donorName: donorName || 'Supporter',
          donorMessage,
          orderType: orderType || 'coffee',
          bankCode: bankCode || 'VNPAYQR',
          language,
        },
        clientIp,
        userUid
      )

      res.status(200).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public static async createVipPayment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { plan, bankCode, language } = req.body
      const userUid = req.user?.uid || req.body.userUid

      if (!userUid) {
        res.status(401).json({ success: false, error: 'Yêu cầu đăng nhập tài khoản trước khi nạp VIP' })
        return
      }

      const planPrices: Record<string, number> = {
        monthly: 99000,
        quarterly: 249000,
        annual: 699000,
        lifetime: 499000,
      }

      const normalizedPlan = (plan || 'monthly').toLowerCase()
      const amount = planPrices[normalizedPlan] || 99000
      const donorName = req.user?.displayName || req.body.donorName || 'Hội viên VIP'

      const rawIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1'
      const clientIp = rawIp.split(',')[0].trim()

      const result = await VnpayService.createPaymentUrl(
        {
          amount,
          donorName,
          donorMessage: `Nap VIP (${normalizedPlan.toUpperCase()}) cho tai khoan`,
          orderType: `vip_${normalizedPlan}`,
          bankCode: bankCode || 'VNPAYQR',
          language: language || 'vn',
        },
        clientIp,
        userUid
      )

      res.status(200).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public static async verifyReturn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams = req.query as Record<string, string>
      const result = await VnpayService.verifyReturn(queryParams)

      res.status(200).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public static async handleIpn(req: Request, res: Response): Promise<void> {
    try {
      const queryParams = req.query as Record<string, string>
      const result = await VnpayService.verifyReturn(queryParams)

      if (!result.isValid) {
        res.status(200).json({ RspCode: '97', Message: 'Checksum failed' })
        return
      }

      res.status(200).json({ RspCode: '00', Message: 'Confirm Success' })
    } catch {
      res.status(200).json({ RspCode: '99', Message: 'Unknow error' })
    }
  }

  public static async getRecent(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await VnpayService.getRecentContributions()
      res.status(200).json({ success: true, data: list })
    } catch (error) {
      next(error)
    }
  }
}

