import { Router } from 'express'
import { authRouter } from './auth.routes'
import { guestbookRouter } from './guestbook.routes'
import { contactRouter } from './contact.routes'
import { projectRouter } from './project.routes'
import { healthRouter } from './health.routes'
import { paymentRouter } from './payment.routes'
import { telemetryRouter } from './telemetry.routes'
import { adminRouter } from './admin.routes'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/admin', adminRouter)
apiRouter.use('/guestbook', guestbookRouter)
apiRouter.use('/contact', contactRouter)
apiRouter.use('/projects', projectRouter)
apiRouter.use('/health', healthRouter)
apiRouter.use('/payment', paymentRouter)
apiRouter.use('/telemetry', telemetryRouter)
