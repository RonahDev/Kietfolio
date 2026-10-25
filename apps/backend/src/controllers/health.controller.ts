import { Request, Response } from 'express'
import { testDbConnection } from '../db/pool'
import { taskQueue } from '../resilience/taskQueue'

export class HealthController {
  public static async getHealth(_req: Request, res: Response): Promise<void> {
    const isDbConnected = await testDbConnection()
    const memory = process.memoryUsage()
    const queueMetrics = taskQueue.getMetrics()

    res.status(200).json({
      status: 'operational',
      system: 'Kietfolio Core Backend Matrix',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: isDbConnected ? 'connected' : 'fallback-active',
        engine: 'PostgreSQL 16',
      },
      resilience: {
        workerQueue: {
          pendingJobs: queueMetrics.pendingJobs,
          activeWorkers: queueMetrics.activeWorkers,
          dlqCount: queueMetrics.deadLetterQueueCount,
        },
      },
      telemetry: {
        rssMb: Math.round(memory.rss / 1024 / 1024),
        heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
      },
    })
  }
}
