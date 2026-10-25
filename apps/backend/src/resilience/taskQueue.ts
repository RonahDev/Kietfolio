import { logger } from './logger'

export interface QueueJob<T = unknown> {
  id: string
  name: string
  payload: T
  retries: number
  maxRetries: number
  createdAt: string
  handler: (payload: T) => Promise<void>
}

export interface DeadLetterEntry<T = unknown> {
  jobId: string
  name: string
  payload: T
  attempts: number
  failedAt: string
  error: string
}

/**
 * In-memory resilient background Worker Queue with Dead-Letter Queue (DLQ).
 * Offloads long-running tasks (e.g. notifications, reporting, indexing)
 * from the HTTP request cycle to maintain high server throughput and low latency.
 */
export class TaskQueue {
  private queue: QueueJob[] = []
  private deadLetterQueue: DeadLetterEntry[] = []
  private activeWorkers = 0
  private maxConcurrency: number
  private isProcessing = false

  constructor(maxConcurrency = 3) {
    this.maxConcurrency = maxConcurrency
  }

  /**
   * Enqueues a job for asynchronous background processing
   */
  enqueue<T>(
    name: string,
    payload: T,
    handler: (payload: T) => Promise<void>,
    maxRetries = 3
  ): string {
    const id = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const job: QueueJob<unknown> = {
      id,
      name,
      payload,
      retries: 0,
      maxRetries,
      createdAt: new Date().toISOString(),
      handler: handler as (payload: unknown) => Promise<void>,
    }

    this.queue.push(job)
    logger.info(`[Task Queue Enqueued]: Job ${name} [${id}] queued (queue depth: ${this.queue.length})`)

    this.processNext()
    return id
  }

  private async processNext() {
    if (this.activeWorkers >= this.maxConcurrency || this.queue.length === 0) {
      return
    }

    const job = this.queue.shift()
    if (!job) return

    this.activeWorkers++

    try {
      await job.handler(job.payload)
      logger.info(`[Task Queue Completed]: Job ${job.name} [${job.id}] finished successfully`)
    } catch (error) {
      job.retries++
      const errMsg = error instanceof Error ? error.message : String(error)

      if (job.retries <= job.maxRetries) {
        // Exponential backoff before re-enqueuing
        const delayMs = Math.pow(2, job.retries) * 500
        logger.warn(
          `[Task Queue Failed]: Job ${job.name} [${job.id}] failed (attempt ${job.retries}/${job.maxRetries}). Re-queueing in ${delayMs}ms...`,
          undefined,
          error
        )
        setTimeout(() => {
          this.queue.push(job)
          this.processNext()
        }, delayMs)
      } else {
        // Job exceeded max retries: Route to Dead-Letter Queue (DLQ)
        const deadLetterEntry: DeadLetterEntry = {
          jobId: job.id,
          name: job.name,
          payload: job.payload,
          attempts: job.retries,
          failedAt: new Date().toISOString(),
          error: errMsg,
        }
        this.deadLetterQueue.push(deadLetterEntry)
        logger.error(
          `[Dead-Letter Queue]: Job ${job.name} [${job.id}] permanently failed after ${job.retries} attempts and routed to DLQ`,
          error,
          { jobId: job.id, name: job.name }
        )
      }
    } finally {
      this.activeWorkers--
      this.processNext()
    }
  }

  getMetrics() {
    return {
      pendingJobs: this.queue.length,
      activeWorkers: this.activeWorkers,
      maxConcurrency: this.maxConcurrency,
      deadLetterQueueCount: this.deadLetterQueue.length,
      recentDlqEntries: this.deadLetterQueue.slice(-5),
    }
  }
}

export const taskQueue = new TaskQueue()
