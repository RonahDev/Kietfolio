import { Router } from 'express'
import { z } from 'zod'
import { ContactController } from '../controllers/contact.controller'
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware'
import { contactLimiter } from '../middlewares/rateLimiter.middleware'
import { validateBody } from '../middlewares/validator.middleware'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000),
  honeypot: z.string().optional(),
})

export const contactRouter = Router()

contactRouter.post('/', contactLimiter, validateBody(contactSchema), ContactController.submit)
contactRouter.get('/', verifyToken, requireAdmin, ContactController.getAll)
contactRouter.patch('/:id/read', verifyToken, requireAdmin, ContactController.markRead)
