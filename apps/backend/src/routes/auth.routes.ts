import { Router } from 'express'
import { z } from 'zod'
import { AuthController } from '../controllers/auth.controller'
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware'
import { authLimiter } from '../middlewares/rateLimiter.middleware'
import { validateBody } from '../middlewares/validator.middleware'

const registerSchema = z.object({
  email: z.string().email('Valid email address required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email('Valid email address required'),
  password: z.string().min(1, 'Password is required'),
})

export const authRouter = Router()

authRouter.post('/register', authLimiter, validateBody(registerSchema), AuthController.register)
authRouter.post('/login', authLimiter, validateBody(loginSchema), AuthController.login)
authRouter.post('/google', authLimiter, AuthController.googleAuth)
authRouter.get('/me', verifyToken, AuthController.getMe)
authRouter.get('/users', verifyToken, requireAdmin, AuthController.listUsers)

