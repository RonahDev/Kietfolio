import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config/env'
import { apiRouter } from './routes'
import { apiLimiter } from './middlewares/rateLimiter.middleware'
import { errorHandler } from './middlewares/errorHandler.middleware'

export const app = express()

// 1. Security & Hygiene Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible integration with Vite frontend
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true)
      return callback(null, true)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// 2. Request Logging & Body Parsing
if (config.env !== 'test') {
  app.use(morgan('dev'))
}
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// 3. Global API Rate Limiter
app.use('/api', apiLimiter)

// 4. Mount API Routes
app.use('/api', apiRouter)

// 5. Root Welcome Route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    name: 'Kietfolio Core Backend API',
    version: '1.0.0',
    documentation: '/api/health',
  })
})

// 6. 404 Not Found Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  })
})

// 7. Central Error Handling Middleware
app.use(errorHandler)
