import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { AuthenticatedRequest } from '../types'

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, displayName } = req.body
      const result = await AuthService.registerWithEmail(email, password, displayName)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message })
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body
      const result = await AuthService.loginWithEmail(email, password)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(401).json({ success: false, error: (error as Error).message })
    }
  }

  public static async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    res.status(200).json({ success: true, data: { user: req.user } })
  }
}

