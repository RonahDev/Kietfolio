import cluster from 'node:cluster'
import os from 'node:os'
import { app } from './app'
import { config } from './config/env'
import { testDbConnection, pool } from './db/pool'
import { MovieSyncScheduler } from './services/movieSyncScheduler.service'

const shouldEnableCluster =
  (config.env === 'production' || process.env.ENABLE_CLUSTER === 'true') &&
  process.env.DISABLE_CLUSTER !== 'true'

async function startWorker(workerId?: number) {
  const isDbReady = await testDbConnection()
  if (isDbReady) {
    // eslint-disable-next-line no-console
    console.log(
      `[Database]: PostgreSQL connected successfully on ${config.db.host}:${config.db.port} ${
        workerId ? `(Worker ${workerId})` : ''
      }`
    )
  } else {
    // eslint-disable-next-line no-console
    console.log(`[Database]: Operating with high-availability in-memory fallback ${workerId ? `(Worker ${workerId})` : ''}`)
  }

  const server = app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(
      `🚀 [Kietfolio Backend Server]: Listening on port ${config.port} (${config.env}) ${
        workerId ? `[Worker PID: ${process.pid}]` : ''
      }`
    )
    if (!workerId || workerId === 1) {
      // eslint-disable-next-line no-console
      console.log(`⚡ [API Health Endpoint]: http://localhost:${config.port}/api/health`)
      // Initialize background automated movie sync worker
      MovieSyncScheduler.start().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[MovieSyncScheduler Initialization Error]:', err)
      })
    }
  })

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    // eslint-disable-next-line no-console
    console.log(`\n[Shutdown]: ${signal} received by PID ${process.pid}. Closing HTTP server...`)
    MovieSyncScheduler.stop()
    server.close(async () => {
      try {
        await pool.end()
        // eslint-disable-next-line no-console
        console.log(`[Shutdown]: Database pool closed cleanly for PID ${process.pid}. Exiting.`)
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
    console.error(`[System Uncaught Exception PID ${process.pid}]:`, err)
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
    console.error(`[System Unhandled Promise Rejection PID ${process.pid}]:`, reason)
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

async function bootstrap() {
  if (shouldEnableCluster && cluster.isPrimary) {
    const numCpus = os.cpus().length
    const numWorkers = Math.min(numCpus, parseInt(process.env.WORKERS || '4', 10))

    // eslint-disable-next-line no-console
    console.log(`👑 [Cluster Primary]: Starting ${numWorkers} worker processes across ${numCpus} CPU cores...`)

    for (let i = 0; i < numWorkers; i++) {
      cluster.fork({ WORKER_INDEX: String(i + 1) })
    }

    cluster.on('exit', (worker, code, signal) => {
      // eslint-disable-next-line no-console
      console.warn(`⚠️ [Cluster Warning]: Worker PID ${worker.process.pid} exited (code: ${code}, signal: ${signal}). Spawning replacement...`)
      cluster.fork()
    })

    const primaryShutdown = (signal: string) => {
      // eslint-disable-next-line no-console
      console.log(`\n👑 [Cluster Primary]: Received ${signal}. Terminating all workers cleanly...`)
      for (const id in cluster.workers) {
        cluster.workers[id]?.process.kill('SIGTERM')
      }
      setTimeout(() => process.exit(0), 3000)
    }

    process.on('SIGTERM', () => primaryShutdown('SIGTERM'))
    process.on('SIGINT', () => primaryShutdown('SIGINT'))
  } else {
    const workerIndex = process.env.WORKER_INDEX ? parseInt(process.env.WORKER_INDEX, 10) : undefined
    await startWorker(workerIndex)
  }
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[Bootstrap Critical Failure]:', err)
  process.exit(1)
})
