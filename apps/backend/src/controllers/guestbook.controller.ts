import { Request, Response, NextFunction } from 'express'
import { GuestbookService } from '../services/guestbook.service'
import { AuthenticatedRequest } from '../types'

export class GuestbookController {
  public static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await GuestbookService.getAll()
      res.status(200).json({ success: true, data: messages })
    } catch (error) {
      next(error)
    }
  }

  public static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, avatar, roleTitle, message } = req.body
      const user = req.user

      const created = await GuestbookService.create({
        name: user?.displayName || name,
        avatar: user?.photoURL || avatar,
        roleTitle,
        message,
        isGoogleVerified: user?.provider === 'google',
        userUid: user?.uid,
      })

      res.status(201).json({ success: true, data: created })
    } catch (error) {
      next(error)
    }
  }

  public static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      await GuestbookService.delete(id)
      res.status(200).json({ success: true, message: 'Guestbook entry removed successfully' })
    } catch (error) {
      next(error)
    }
  }
}

