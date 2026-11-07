import { app } from './app'
import { config } from './config/env'
import { testDbConnection, pool } from './db/pool'

async function bootstrap() {
  const isDbReady = await testDbConnection()
  if (isDbReady) {
    // eslint-disable-next-line no-console
    console.log(`[Database]: PostgreSQL connected successfully on ${config.db.host}:${config.db.port}`)
  } else {
    // eslint-disable-next-line no-console
    console.log('[Database]: Operating with high-availability in-memory fallback')
  }

  const server = app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 [Kietfolio Backend Server]: Listening on port ${config.port} (${config.env})`)
    // eslint-disable-next-line no-console
    console.log(`⚡ [API Health Endpoint]: http://localhost:${config.port}/api/health`)
  })

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    // eslint-disable-next-line no-console
    console.log(`\n[Shutdown]: ${signal} received. Closing HTTP server and database pool...`)
    server.close(async () => {
      try {
        await pool.end()
        // eslint-disable-next-line no-console
        console.log('[Shutdown]: Database pool closed cleanly. Process exiting.')
        process.exit(0)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[Shutdown Error]:', err)
        process.exit(1)
      }
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  // Central System Exception & Rejection Interceptors
  process.on('uncaughtException', (err: Error) => {
    // eslint-disable-next-line no-console
    console.error('[System Uncaught Exception]:', err)
    try {
      // Dynamic import to avoid circular dependency
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ErrorLogService } = require('./services/errorLog.service')
      ErrorLogService.record({
        source: 'system',
        level: 'critical',
        name: err.name || 'UncaughtException',
        message: err.message,
        stack: err.stack,
        path: 'process.uncaughtException',
      })
    } catch {
      // ignore
    }
  })

  process.on('unhandledRejection', (reason: unknown) => {
    // eslint-disable-next-line no-console
    console.error('[System Unhandled Promise Rejection]:', reason)
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ErrorLogService } = require('./services/errorLog.service')
      ErrorLogService.record({
        source: 'system',
        level: 'error',
        name: 'UnhandledRejection',
        message: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
        path: 'process.unhandledRejection',
      })
    } catch {
      // ignore
    }
  })
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[Bootstrap Critical Failure]:', err)
  process.exit(1)
})

