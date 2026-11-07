import { Request, Response } from 'express'
import { ErrorLogService } from '../services/errorLog.service'
import type { ErrorLogSource, ErrorLogLevel, AuthenticatedRequest } from '../types'

export class TelemetryController {
  /**
   * POST /api/telemetry/errors
   * Ingest client-side error log from user browser
   */
  public static async recordClientError(req: Request, res: Response): Promise<void> {
    const {
      message,
      name,
      stack,
      path: clientPath,
      level,
      userId,
      userEmail,
      userRole,
      clientContext,
      meta,
    } = req.body || {}

    if (!message || typeof message !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Missing required error message parameter',
      })
      return
    }

    const recorded = ErrorLogService.record({
      source: 'client',
      level: (level as ErrorLogLevel) || 'error',
      name: typeof name === 'string' ? name : 'ClientRuntimeError',
      message: message.slice(0, 1000), // Bound length
      stack: typeof stack === 'string' ? stack.slice(0, 5000) : undefined,
      path: typeof clientPath === 'string' ? clientPath : req.headers.referer,
      userId: typeof userId === 'string' ? userId : undefined,
      userEmail: typeof userEmail === 'string' ? userEmail : undefined,
      userRole: typeof userRole === 'string' ? userRole : undefined,
      ip: (req.headers['x-forwarded-for'] as string) || req.ip || req.socket?.remoteAddress,
      clientContext: typeof clientContext === 'object' ? clientContext : undefined,
      meta: typeof meta === 'object' ? meta : undefined,
    })

    res.status(201).json({
      success: true,
      data: {
        id: recorded.id,
        timestamp: recorded.timestamp,
      },
    })
  }

  /**
   * GET /api/telemetry/errors
   * Query error logs with filtering
   */
  public static async getLogs(req: Request, res: Response): Promise<void> {
    const { source, level, search, limit } = req.query

    const logs = ErrorLogService.getLogs({
      source: source ? (source as ErrorLogSource) : undefined,
      level: level ? (level as ErrorLogLevel) : undefined,
      search: typeof search === 'string' ? search : undefined,
      limit: limit ? Number(limit) : undefined,
    })

    res.status(200).json({
      success: true,
      data: {
        total: logs.length,
        logs,
      },
    })
  }

  /**
   * DELETE /api/telemetry/errors
   * Clear error logs (Admin only)
   */
  public static async clearLogs(_req: AuthenticatedRequest, res: Response): Promise<void> {
    ErrorLogService.clearLogs()
    res.status(200).json({
      success: true,
      message: 'All error telemetry logs have been cleared successfully.',
    })
  }
}
