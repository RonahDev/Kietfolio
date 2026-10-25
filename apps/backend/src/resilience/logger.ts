import { config } from '../config/env'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  service: string
  environment: string
  requestId?: string
  durationMs?: number
  error?: {
    name: string
    message: string
    stack?: string
  }
  meta?: Record<string, unknown>
}

class StructuredLogger {
  private serviceName = 'kietfolio-backend'

  private formatError(err: unknown) {
    if (err instanceof Error) {
      return {
        name: err.name,
        message: err.message,
        stack: config.env === 'production' ? undefined : err.stack,
      }
    }
    return err ? { name: 'UnknownError', message: String(err) } : undefined
  }

  private write(level: LogLevel, message: string, meta?: Record<string, unknown>, err?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      environment: config.env,
      error: this.formatError(err),
      meta,
    }

    if (config.env === 'production') {
      // Machine-readable structured JSON in production for Datadog / Loki / ELK
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(entry))
    } else {
      // Human-readable formatted output in development
      const color =
        level === 'error'
          ? '\x1b[31m'
          : level === 'warn'
          ? '\x1b[33m'
          : level === 'debug'
          ? '\x1b[36m'
          : '\x1b[32m'
      const reset = '\x1b[0m'
      // eslint-disable-next-line no-console
      console.log(
        `${color}[${entry.level.toUpperCase()}]${reset} [${entry.timestamp}] ${entry.message}`,
        meta ? JSON.stringify(meta) : '',
        err || ''
      )
    }
  }

  debug(message: string, meta?: Record<string, unknown>) {
    this.write('debug', message, meta)
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.write('info', message, meta)
  }

  warn(message: string, meta?: Record<string, unknown>, err?: unknown) {
    this.write('warn', message, meta, err)
  }

  error(message: string, err?: unknown, meta?: Record<string, unknown>) {
    this.write('error', message, meta, err)
  }
}

export const logger = new StructuredLogger()
