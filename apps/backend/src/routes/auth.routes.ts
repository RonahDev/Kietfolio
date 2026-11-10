import { Router } from 'express'
import { z } from 'zod'
import { AuthController } from '../controllers/auth.controller'
import { AdminAuthController } from '../controllers/adminAuth.controller'
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware'
import { sessionAuth } from '../middlewares/sessionAuth.middleware'
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

// Standard Client / Member Authentication
authRouter.post('/register', authLimiter, validateBody(registerSchema), AuthController.register)
authRouter.post('/login', authLimiter, validateBody(loginSchema), AuthController.login)
authRouter.post('/google', authLimiter, AuthController.googleAuth)
authRouter.get('/legacy-me', verifyToken, AuthController.getMe)
authRouter.get('/users', verifyToken, requireAdmin, AuthController.listUsers)

// Production Enterprise Admin Session & Cookie Authentication
authRouter.post('/admin-login', authLimiter, AdminAuthController.adminLogin)
authRouter.post('/logout', sessionAuth, AdminAuthController.logout)
authRouter.get('/me', sessionAuth, AdminAuthController.getMe)
authRouter.get('/sessions', sessionAuth, AdminAuthController.getSessions)
authRouter.delete('/sessions/:sessionId', sessionAuth, AdminAuthController.revokeSession)
authRouter.post('/sessions/revoke-others', sessionAuth, AdminAuthController.revokeOtherSessions)

