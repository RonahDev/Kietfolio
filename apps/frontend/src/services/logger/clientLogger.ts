import type { ErrorLogItem, ErrorLogLevel, ClientDeviceContext } from '@kietfolio/shared-types'

const LOCAL_LOGS_KEY = 'kietfolio_client_error_logs'
const MAX_LOCAL_LOGS = 50

class ClientLogger {
  private isInitialized = false

  /**
   * Gather comprehensive device, screen & hardware telemetry
   */
  public getClientContext(): ClientDeviceContext {
    if (typeof window === 'undefined') return {}

    const nav = navigator as Navigator & {
      deviceMemory?: number
    }

    return {
      userAgent: nav.userAgent,
      language: nav.language,
      platform: nav.platform,
      screenResolution: typeof window.screen !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : undefined,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      cores: nav.hardwareConcurrency,
      memoryGb: nav.deviceMemory,
      effectiveTier: document.documentElement.classList.contains('perf-low')
        ? 'low'
        : document.documentElement.classList.contains('perf-medium')
        ? 'medium'
        : 'high',
      online: nav.onLine,
    }
  }

  /**
   * Retrieve active user context from storage if authenticated
   */
  private getUserContext() {
    try {
      const session = localStorage.getItem('kietfolio_auth_active_session')
      if (session) {
        const parsed = JSON.parse(session)
        return {
          userId: parsed.uid as string | undefined,
          userEmail: parsed.email as string | undefined,
          userRole: parsed.role as string | undefined,
        }
      }
    } catch {
      // ignore
    }
    return {}
  }

  /**
   * Save error entry into browser LocalStorage buffer
   */
  private saveLocal(item: ErrorLogItem) {
    try {
      const existing: ErrorLogItem[] = JSON.parse(
        localStorage.getItem(LOCAL_LOGS_KEY) || '[]'
      )
      const updated = [item, ...existing].slice(0, MAX_LOCAL_LOGS)
      localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(updated))
    } catch {
      // Local storage may be full or restricted
    }
  }

  /**
   * Asynchronously report error to backend telemetry ingestion endpoint
   */
  private async reportRemote(item: ErrorLogItem) {
    try {
      const payload = JSON.stringify({
        message: item.message,
        name: item.name,
        stack: item.stack,
        path: item.path,
        level: item.level,
        userId: item.userId,
        userEmail: item.userEmail,
        userRole: item.userRole,
        clientContext: item.clientContext,
        meta: item.meta,
      })

      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([payload], { type: 'application/json' })
        navigator.sendBeacon('/api/telemetry/errors', blob)
      } else {
        await fetch('/api/telemetry/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {
          // Silent fallback when backend is unreachable
        })
      }
    } catch {
      // Non-blocking telemetry
    }
  }

  /**
   * Log an error from anywhere in the application
   */
  public log(params: {
    message: string
    name?: string
    stack?: string
    level?: ErrorLogLevel
    meta?: Record<string, unknown>
  }): ErrorLogItem {
    const user = this.getUserContext()
    const clientContext = this.getClientContext()
    const path = typeof window !== 'undefined' ? window.location.pathname + window.location.hash : ''

    const item: ErrorLogItem = {
      id: `err_client_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      source: 'client',
      level: params.level || 'error',
      name: params.name || 'ClientException',
      message: params.message,
      stack: params.stack,
      path,
      userId: user.userId,
      userEmail: user.userEmail,
      userRole: user.userRole,
      clientContext,
      meta: params.meta,
    }

    this.saveLocal(item)
    this.reportRemote(item)

    // Notify developer console
    if (typeof console !== 'undefined' && console.error) {
      console.error(`[Kietfolio Client Logger]: ${item.message}`, item)
    }

    return item
  }

  public error(message: string, error?: unknown, meta?: Record<string, unknown>): ErrorLogItem {
    let errName = 'Error'
    let errStack: string | undefined
    let errMsg = message

    if (error instanceof Error) {
      errName = error.name
      errStack = error.stack
      errMsg = `${message}: ${error.message}`
    } else if (typeof error === 'string') {
      errMsg = `${message}: ${error}`
    }

    return this.log({
      message: errMsg,
      name: errName,
      stack: errStack,
      level: 'error',
      meta,
    })
  }

  public warn(message: string, meta?: Record<string, unknown>): ErrorLogItem {
    return this.log({
      message,
      name: 'ClientWarning',
      level: 'warn',
      meta,
    })
  }

  /**
   * Retrieve all locally stored error logs
   */
  public getLocalLogs(): ErrorLogItem[] {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY) || '[]')
    } catch {
      return []
    }
  }

  /**
   * Clear all locally stored error logs
   */
  public clearLocalLogs(): void {
    try {
      localStorage.removeItem(LOCAL_LOGS_KEY)
    } catch {
      // ignore
    }
  }

  /**
   * Export all local error logs formatted as JSON text
   */
  public exportLogsJson(): string {
    const logs = this.getLocalLogs()
    const report = {
      exportedAt: new Date().toISOString(),
      deviceContext: this.getClientContext(),
      totalErrors: logs.length,
      logs,
    }
    return JSON.stringify(report, null, 2)
  }

  /**
   * Download error logs as a JSON file for easy user bug reporting
   */
  public downloadLogsFile(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const content = this.exportLogsJson()
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kietfolio-error-report-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Initialize automatic global window error and unhandled rejection listeners
   */
  public initGlobalErrorLogging(): void {
    if (this.isInitialized || typeof window === 'undefined') return
    this.isInitialized = true

    window.addEventListener('error', (event: ErrorEvent) => {
      // Ignore cross-origin script errors with no details
      if (!event.message && !event.error) return

      this.log({
        message: event.message || 'Uncaught window error',
        name: event.error?.name || 'UncaughtError',
        stack: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
        level: 'critical',
      })
    })

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      const reason = event.reason
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === 'string'
          ? reason
          : 'Unhandled Promise rejection'

      this.log({
        message,
        name: reason instanceof Error ? reason.name : 'UnhandledPromiseRejection',
        stack: reason instanceof Error ? reason.stack : undefined,
        level: 'error',
      })
    })
  }
}

export const clientLogger = new ClientLogger()
