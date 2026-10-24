import { Request, Response, NextFunction } from 'express'
import { ContactService } from '../services/contact.service'
import { AuthenticatedRequest } from '../types'

export class ContactController {
  public static async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, subject, message, honeypot } = req.body
      const result = await ContactService.createMessage({
        name,
        email,
        subject,
        message,
        honeypot,
      })

      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public static async getAll(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await ContactService.getAllMessages()
      res.status(200).json({ success: true, data: messages })
    } catch (error) {
      next(error)
    }
  }

  public static async markRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      await ContactService.markAsRead(id)
      res.status(200).json({ success: true, message: 'Message marked as read' })
    } catch (error) {
      next(error)
    }
  }
}

