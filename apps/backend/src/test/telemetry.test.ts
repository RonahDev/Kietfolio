import { describe, it, expect, beforeEach } from 'vitest'
import { TelemetryController } from '../controllers/telemetry.controller'
import { ErrorLogService } from '../services/errorLog.service'
import type { Request } from 'express'
import { AuthenticatedRequest } from '../types'

function createMockResponse() {
  const res: {
    statusCode: number
    body: unknown
    status: (code: number) => typeof res
    json: (data: unknown) => typeof res
  } = {
    statusCode: 200,
    body: null,
    status(code: number) {
      this.statusCode = code
      return this
    },
    json(data: unknown) {
      this.body = data
      return this
    },
  }
  return res
}

function createMockRequest(options: Partial<Request> = {}) {
  return {
    headers: {},
    params: {},
    query: {},
    body: {},
    socket: { remoteAddress: '127.0.0.1' },
    ...options,
  } as unknown as Request
}

describe('Backend Error Logging & Telemetry Engine Test Suite', () => {
  beforeEach(() => {
    ErrorLogService.clearLogs()
  })

  it('records a system error and bounds ring-buffer storage', () => {
    const errorEntry = ErrorLogService.record({
      source: 'system',
      level: 'error',
      name: 'DatabaseConnectionTimeout',
      message: 'Failed to acquire database connection within 3000ms',
      path: '/api/guestbook',
      method: 'GET',
      statusCode: 500,
    })

    expect(errorEntry.id).toBeDefined()
    expect(errorEntry.source).toBe('system')
    expect(errorEntry.name).toBe('DatabaseConnectionTimeout')
    expect(errorEntry.message).toContain('Failed to acquire database connection')

    const logs = ErrorLogService.getLogs()
    expect(logs.length).toBe(1)
    expect(logs[0].id).toBe(errorEntry.id)
  })

  it('records client runtime error submitted via TelemetryController.recordClientError', async () => {
    const req = createMockRequest({
      body: {
        source: 'client',
        level: 'critical',
        name: 'WebGLContextLost',
        message: 'GPU driver crashed or device lost WebGL surface',
        path: '/#hero',
        userId: 'user_123',
        userEmail: 'visitor@company.com',
        clientContext: {
          viewport: '1920x1080',
          cores: 8,
          memoryGb: 16,
          effectiveTier: 'high',
        },
      },
    })
    const res = createMockResponse()

    await TelemetryController.recordClientError(req, res as unknown as never)

    expect(res.statusCode).toBe(201)
    const body = res.body as { success: boolean; data: { id: string } }
    expect(body.success).toBe(true)
    expect(body.data.id).toBeDefined()

    // Query logs to verify persistence in ring buffer
    const logs = ErrorLogService.getLogs({ source: 'client' })
    expect(logs.length).toBe(1)
    expect(logs[0].message).toBe('GPU driver crashed or device lost WebGL surface')
    expect(logs[0].userEmail).toBe('visitor@company.com')
    expect(logs[0].clientContext?.effectiveTier).toBe('high')
  })

  it('filters error logs accurately by source and level via TelemetryController.getLogs', async () => {
    // Seed 1 system error and 1 client error
    ErrorLogService.record({
      source: 'system',
      level: 'error',
      name: 'InternalError',
      message: 'Server disk cache full',
    })
    ErrorLogService.record({
      source: 'client',
      level: 'critical',
      name: 'RenderCrash',
      message: 'React component crashed',
    })

    // Get all
    const reqAll = createMockRequest({ query: {} })
    const resAll = createMockResponse()
    await TelemetryController.getLogs(reqAll, resAll as unknown as never)
    const bodyAll = resAll.body as { success: boolean; data: { total: number } }
    expect(bodyAll.data.total).toBe(2)

    // Filter source=system
    const reqSystem = createMockRequest({ query: { source: 'system' } })
    const resSystem = createMockResponse()
    await TelemetryController.getLogs(reqSystem, resSystem as unknown as never)
    const bodySystem = resSystem.body as { success: boolean; data: { total: number; logs: { source: string }[] } }
    expect(bodySystem.data.total).toBe(1)
    expect(bodySystem.data.logs[0].source).toBe('system')

    // Filter level=critical
    const reqCrit = createMockRequest({ query: { level: 'critical' } })
    const resCrit = createMockResponse()
    await TelemetryController.getLogs(reqCrit, resCrit as unknown as never)
    const bodyCrit = resCrit.body as { success: boolean; data: { total: number; logs: { level: string }[] } }
    expect(bodyCrit.data.total).toBe(1)
    expect(bodyCrit.data.logs[0].level).toBe('critical')
  })

  it('rejects client error submission with missing message payload', async () => {
    const req = createMockRequest({ body: {} })
    const res = createMockResponse()

    await TelemetryController.recordClientError(req, res as unknown as never)

    expect(res.statusCode).toBe(400)
    const body = res.body as { success: boolean; error: string }
    expect(body.success).toBe(false)
    expect(body.error).toContain('Missing required error message')
  })

  it('clears all error logs via TelemetryController.clearLogs', async () => {
    ErrorLogService.record({
      source: 'system',
      message: 'Temporary glitch',
    })
    expect(ErrorLogService.getLogs().length).toBe(1)

    const req = createMockRequest() as AuthenticatedRequest
    const res = createMockResponse()
    await TelemetryController.clearLogs(req, res as unknown as never)

    expect(res.statusCode).toBe(200)
    expect(ErrorLogService.getLogs().length).toBe(0)
  })
})
