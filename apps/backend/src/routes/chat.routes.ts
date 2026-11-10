import { Router } from 'express'
import { ChatController } from '../controllers/chat.controller'
import { chatLimiter } from '../middlewares/rateLimiter.middleware'

export const chatRouter = Router()

// Public endpoint with rate limiting: 40 chat queries per minute
chatRouter.post('/', chatLimiter, ChatController.query)
