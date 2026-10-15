import { Router } from 'express'
import { z } from 'zod'
import { GuestbookController } from '../controllers/guestbook.controller'
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware'
import { validateBody } from '../middlewares/validator.middleware'

const guestbookEntrySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  avatar: z.string().optional(),
  roleTitle: z.string().optional(),
  message: z.string().min(3, 'Message must be at least 3 characters').max(500, 'Message cannot exceed 500 characters'),
})

export const guestbookRouter = Router()

guestbookRouter.get('/', GuestbookController.getAll)
guestbookRouter.post('/', validateBody(guestbookEntrySchema), GuestbookController.create)
guestbookRouter.delete('/:id', verifyToken, requireAdmin, GuestbookController.delete)
