import type { ErrorLogItem, ErrorLogSource, ErrorLogLevel } from '../types'
import { logger } from '../resilience/logger'

const MAX_STORED_LOGS = 200

// In-memory ring buffer for high-speed zero-latency log retention
const errorLogsRingBuffer: ErrorLogItem[] = [
  {
    id: `err_boot_${Date.now()}`,
    timestamp: new Date().toISOString(),
    source: 'system',
    level: 'warn',
    name: 'SystemTelemetryInitialized',
    message: 'Kietfolio Central Error Logging & Telemetry Engine initialized successfully.',
    path: '/system/telemetry',
    method: 'BOOT',
    statusCode: 200,
  },
]

export class ErrorLogService {
  /**
   * Record a new system or client error log
   */
  public static record(entry: {
    source: ErrorLogSource
    level?: ErrorLogLevel
    message: string
    name?: string
    stack?: string
    path?: string
    method?: string
    statusCode?: number
    userId?: string
    userEmail?: string
    userRole?: string
    ip?: string
    clientContext?: ErrorLogItem['clientContext']
    meta?: Record<string, unknown>
  }): ErrorLogItem {
    const id = `err_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const timestamp = new Date().toISOString()
    const level: ErrorLogLevel = entry.level || 'error'

    const item: ErrorLogItem = {
      id,
      timestamp,
      source: entry.source,
      level,
      message: entry.message,
      name: entry.name || (entry.source === 'system' ? 'SystemError' : 'ClientError'),
      stack: entry.stack,
      path: entry.path,
      method: entry.method,
      statusCode: entry.statusCode,
      userId: entry.userId,
      userEmail: entry.userEmail,
      userRole: entry.userRole,
      ip: entry.ip,
      clientContext: entry.clientContext,
      meta: entry.meta,
    }

    // Prepend to ring buffer (newest first)
    errorLogsRingBuffer.unshift(item)

    // Bound memory size
    if (errorLogsRingBuffer.length > MAX_STORED_LOGS) {
      errorLogsRingBuffer.length = MAX_STORED_LOGS
    }

    // Also pipe to structured logger
    if (level === 'critical' || level === 'error') {
      logger.error(`[${item.source.toUpperCase()}] ${item.message}`, item.stack, {
        id: item.id,
        path: item.path,
        userEmail: item.userEmail,
      })
    } else {
      logger.warn(`[${item.source.toUpperCase()}] ${item.message}`, {
        id: item.id,
        path: item.path,
      })
    }

    return item
  }

  /**
   * Query recorded logs with optional filtering
   */
  public static getLogs(filter?: {
    source?: ErrorLogSource
    level?: ErrorLogLevel
    search?: string
    limit?: number
  }): ErrorLogItem[] {
    let result = [...errorLogsRingBuffer]

    if (filter?.source) {
      result = result.filter((l) => l.source === filter.source)
    }

    if (filter?.level) {
      result = result.filter((l) => l.level === filter.level)
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase()
      result = result.filter(
        (l) =>
          l.message.toLowerCase().includes(q) ||
          (l.name && l.name.toLowerCase().includes(q)) ||
          (l.path && l.path.toLowerCase().includes(q)) ||
          (l.userEmail && l.userEmail.toLowerCase().includes(q))
      )
    }

    const limit = filter?.limit || 100
    return result.slice(0, limit)
  }

  /**
   * Export structured diagnostic report
   */
  public static exportReport() {
    const logs = [...errorLogsRingBuffer]
    return {
      exportedAt: new Date().toISOString(),
      totalErrors: logs.length,
      criticalCount: logs.filter((l) => l.level === 'critical').length,
      errorCount: logs.filter((l) => l.level === 'error').length,
      warnCount: logs.filter((l) => l.level === 'warn').length,
      logs,
    }
  }

  /**
   * Clear all non-system boot logs
   */
  public static clearLogs(): void {
    errorLogsRingBuffer.length = 0
  }
}
