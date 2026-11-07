import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { clientLogger } from './clientLogger'

describe('Client-Side Error Logging & User Telemetry Test Suite', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    clientLogger.clearLocalLogs()
  })

  it('records an error into LocalStorage with user & hardware context', () => {
    // Simulate active user session
    localStorage.setItem(
      'kietfolio_auth_active_session',
      JSON.stringify({
        uid: 'user_tester_99',
        email: 'tester@enterprise.vn',
        role: 'member',
      })
    )

    const logItem = clientLogger.error('Failed to render Three.js canvas', new Error('Out of memory'))

    expect(logItem.id).toBeDefined()
    expect(logItem.source).toBe('client')
    expect(logItem.message).toContain('Failed to render Three.js canvas: Out of memory')
    expect(logItem.userId).toBe('user_tester_99')
    expect(logItem.userEmail).toBe('tester@enterprise.vn')

    // Verify persistence in local storage
    const localLogs = clientLogger.getLocalLogs()
    expect(localLogs.length).toBe(1)
    expect(localLogs[0].id).toBe(logItem.id)
  })

  it('gathers client device and screen diagnostic telemetry accurately', () => {
    const context = clientLogger.getClientContext()

    expect(context).toHaveProperty('viewport')
    expect(context).toHaveProperty('online')
    expect(context).toHaveProperty('effectiveTier')
  })

  it('exports formatted JSON report for user bug sharing and diagnostics', () => {
    clientLogger.warn('Network latency high (> 2000ms)')

    const jsonReport = clientLogger.exportLogsJson()
    expect(jsonReport).toContain('totalErrors')
    expect(jsonReport).toContain('Network latency high')

    const parsed = JSON.parse(jsonReport)
    expect(parsed.totalErrors).toBe(1)
    expect(parsed.logs[0].level).toBe('warn')
  })

  it('clears all local error logs cleanly', () => {
    clientLogger.error('Test error 1')
    clientLogger.error('Test error 2')
    expect(clientLogger.getLocalLogs().length).toBe(2)

    clientLogger.clearLocalLogs()
    expect(clientLogger.getLocalLogs().length).toBe(0)
  })
})
