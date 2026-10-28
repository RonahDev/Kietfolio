import { describe, it, expect, vi } from 'vitest'
import { HealthController } from '../controllers/health.controller'
import { ProjectController } from '../controllers/project.controller'
import { ContactController } from '../controllers/contact.controller'
import { GuestbookController } from '../controllers/guestbook.controller'
import { PaymentController } from '../controllers/payment.controller'
import type { Request, Response, NextFunction } from 'express'

function createMockResponse() {
  const res: {
    statusCode: number
    headers: Record<string, string>
    body: unknown
    status: (code: number) => typeof res
    setHeader: (name: string, value: string) => typeof res
    json: (data: unknown) => typeof res
  } = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code: number) {
      this.statusCode = code
      return this
    },
    setHeader(name: string, value: string) {
      this.headers[name] = value
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

describe('Backend Express Controllers Unit & Integration Tests', () => {
  const mockNext: NextFunction = vi.fn()

  it('HealthController.getHealth - returns operational status and telemetry', async () => {
    const req = createMockRequest()
    const res = createMockResponse()

    await HealthController.getHealth(req, res as unknown as Response)

    expect(res.statusCode).toBe(200)
    const body = res.body as { status: string; database: { status: string } }
    expect(body.status).toBe('operational')
    expect(body.database).toBeDefined()
  })

  it('ProjectController.getAll - returns cached projects list', async () => {
    const req = createMockRequest()
    const res = createMockResponse()

    await ProjectController.getAll(req, res as unknown as Response, mockNext)

    expect(res.statusCode).toBe(200)
    expect(res.headers['Cache-Control']).toBeDefined()
    const body = res.body as { success: boolean; data: unknown[] }
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeGreaterThan(0)
  })

  it('ProjectController.getById - returns single project by id', async () => {
    const req = createMockRequest({ params: { id: 'kietfolio-core' } })
    const res = createMockResponse()

    await ProjectController.getById(req, res as unknown as Response, mockNext)

    expect(res.statusCode).toBe(200)
    const body = res.body as { success: boolean; data: { id: string } }
    expect(body.success).toBe(true)
    expect(body.data.id).toBe('kietfolio-core')
  })

  it('ContactController.submit - creates and stores contact message', async () => {
    const req = createMockRequest({
      body: {
        name: 'QA Inspector',
        email: 'qa@inspection.dev',
        subject: 'API Verification',
        message: 'Validating end-to-end contact message delivery pipeline.',
      },
    })
    const res = createMockResponse()

    await ContactController.submit(req, res as unknown as Response, mockNext)

    expect(res.statusCode).toBe(201)
    const body = res.body as { success: boolean; data: { id: string; success: boolean } }
    expect(body.success).toBe(true)
    expect(body.data.id).toBeDefined()
    expect(body.data.success).toBe(true)
  })

  it('GuestbookController.getAll - returns guestbook messages', async () => {
    const req = createMockRequest()
    const res = createMockResponse()

    await GuestbookController.getAll(req, res as unknown as Response, mockNext)

    expect(res.statusCode).toBe(200)
    const body = res.body as { success: boolean; data: unknown[] }
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('GuestbookController.create - creates a new guestbook entry', async () => {
    const req = createMockRequest({
      body: {
        name: 'Tester',
        message: 'Direct controller invocation test for guestbook.',
      },
    })
    const res = createMockResponse()

    await GuestbookController.create(req, res as unknown as Response, mockNext)

    expect(res.statusCode).toBe(201)
    const body = res.body as { success: boolean; data: { message: string } }
    expect(body.success).toBe(true)
    expect(body.data.message).toContain('Direct controller invocation test')
  })

  it('PaymentController.createPaymentUrl - creates VNPay checkout URL', async () => {
    const req = createMockRequest({
      body: {
        amount: 50000,
        donorName: 'Generous Supporter',
        donorMessage: 'Great job!',
        orderType: 'coffee',
        bankCode: 'VNPAYQR',
      },
    })
    const res = createMockResponse()

    await PaymentController.createPaymentUrl(req, res as unknown as Response, mockNext)

    expect(res.statusCode).toBe(200)
    const body = res.body as { success: boolean; data: { paymentUrl: string; orderId: string } }
    expect(body.success).toBe(true)
    expect(body.data.paymentUrl).toContain('vnp_SecureHash')
    expect(body.data.orderId).toBeDefined()
  })

  it('PaymentController.getRecent - returns recent contributions', async () => {
    const req = createMockRequest()
    const res = createMockResponse()

    await PaymentController.getRecent(req, res as unknown as Response, mockNext)

    expect(res.statusCode).toBe(200)
    const body = res.body as { success: boolean; data: unknown[] }
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
  })
})
