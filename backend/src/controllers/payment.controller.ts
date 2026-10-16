import { Request, Response, NextFunction } from 'express'
import { VnpayService } from '../services/vnpay.service'
import { AuthenticatedRequest } from '../types'

export class PaymentController {
  public static async createPaymentUrl(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount, donorName, donorMessage, orderType, bankCode, language } = req.body

      const rawIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1'
      const clientIp = rawIp.split(',')[0].trim()

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
        req.user?.uid
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

