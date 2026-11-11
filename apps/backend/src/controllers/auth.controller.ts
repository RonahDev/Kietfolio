import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { AuthenticatedRequest } from '../types'

export class AuthController {
  public static async register(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { email, password, displayName } = req.body
      const result = await AuthService.registerWithEmail(email, password, displayName)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  }

  public static async login(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body
      const result = await AuthService.loginWithEmail(email, password)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(401).json({ success: false, error: (error as Error).message })
    }
  }

  public static async googleAuth(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { uid, email, displayName, photoURL } = req.body
      if (!email || !uid) {
        res.status(400).json({ success: false, error: 'Google uid and email are required' })
        return
      }
      const result = await AuthService.googleAuth({ uid, email, displayName, photoURL })
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  }

  public static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    // Refresh user state from database to get live VIP & status updates
    try {
      const freshUser = await AuthService.getUserByIdOrEmail(req.user.uid || req.user.email)
      if (freshUser) {
        res.status(200).json({ success: true, data: { user: freshUser } })
        return
      }
    } catch {}

    res.status(200).json({ success: true, data: { user: req.user } })
  }

  public static async upgradeVip(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Vui lòng đăng nhập để nâng cấp VIP' })
      return
    }

    try {
      const plan = req.body?.plan === 'monthly' ? 'monthly' : 'lifetime'
      const result = await AuthService.upgradeToVip(req.user.uid || req.user.email, plan)
      res.status(200).json({
        success: true,
        message: `Nâng cấp gói VIP (${plan === 'monthly' ? '30 ngày' : 'Trọn đời'}) thành công!`,
        data: result,
      })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  }

  public static async listUsers(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const users = await AuthService.getAllUsers()
      res.status(200).json({ success: true, data: { users } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }
}
