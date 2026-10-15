import { Router } from 'express'
import { authRouter } from './auth.routes'
import { guestbookRouter } from './guestbook.routes'
import { contactRouter } from './contact.routes'
import { projectRouter } from './project.routes'
import { healthRouter } from './health.routes'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/guestbook', guestbookRouter)
apiRouter.use('/contact', contactRouter)
apiRouter.use('/projects', projectRouter)
apiRouter.use('/health', healthRouter)
