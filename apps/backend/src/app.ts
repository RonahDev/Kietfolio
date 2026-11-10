import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { config } from './config/env'
import { apiRouter } from './routes'
import { apiLimiter } from './middlewares/rateLimiter.middleware'
import { errorHandler } from './middlewares/errorHandler.middleware'
import { compressionMiddleware } from './middlewares/compression.middleware'
import { overloadProtectionMiddleware } from './middlewares/overloadProtection.middleware'
import { requestContextMiddleware, idempotencyMiddleware } from './resilience'

export const app = express()

// 1. Enterprise Resilience: Concurrency Overload & Lag Backpressure Guard
app.use(overloadProtectionMiddleware)

// 2. High-Performance Gzip/Deflate Compression (Zero Third-Party Dependency)
app.use(compressionMiddleware)

// 3. Request Context & Distributed Tracing (X-Request-Id)
app.use(requestContextMiddleware)

// 2. Security & Hygiene Middlewares
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
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'Idempotency-Key', 'X-Idempotency-Key', 'X-CSRF-Token'],
  })
)

// Cookie Parser with session secret
app.use(cookieParser(config.session.secret))

// 3. Request Logging & Body Parsing
if (config.env !== 'test') {
  app.use(morgan('dev'))
}
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// 4. Global API Rate Limiter
app.use('/api', apiLimiter)

// 5. Idempotency Guard on API Mutations
app.use('/api', idempotencyMiddleware)

// 6. Mount API Routes
app.use('/api', apiRouter)

// 7. Root Welcome Route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    name: 'Kietfolio Core Backend API',
    version: '1.0.0',
    documentation: '/api/health',
  })
})

// 8. 404 Not Found Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  })
})

// 9. Central Error Handling Middleware
app.use(errorHandler)
