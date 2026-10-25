import { describe, it, expect } from 'vitest'
import { AuthService } from '../services/auth.service'
import jwt from 'jsonwebtoken'
import { config } from '../config/env'

describe('Backend Auth & Identity Management Unit & Security Tests', () => {
  const testEmail = `tester-${Date.now()}@domain.com`
  const testPassword = 'SecurePassword123!'

  it('registers a standard member with hashed password and generates valid JWT', async () => {
    const result = await AuthService.registerWithEmail(testEmail, testPassword, 'Test Explorer')

    expect(result).toBeDefined()
    expect(result.user).toBeDefined()
    expect(result.user.email).toBe(testEmail.toLowerCase())
    expect(result.user.role).toBe('user')
    expect(result.user.displayName).toBe('Test Explorer')
    expect(result.token).toBeDefined()

    // Verify JWT integrity
    const decoded = jwt.verify(result.token, config.jwt.secret) as { uid: string; email: string; role: string }
    expect(decoded.email).toBe(testEmail.toLowerCase())
    expect(decoded.role).toBe('user')
  })

  it('prevents duplicate email registration by throwing duplicate error', async () => {
    await expect(
      AuthService.registerWithEmail(testEmail, 'AnotherPassword456!')
    ).rejects.toThrow(/đã được đăng ký/i)
  })

  it('authenticates standard user with correct password and rejects invalid password', async () => {
    // 1. Correct password
    const loginSuccess = await AuthService.loginWithEmail(testEmail, testPassword)
    expect(loginSuccess.user.email).toBe(testEmail.toLowerCase())
    expect(loginSuccess.token).toBeDefined()

    // 2. Incorrect password
    await expect(
      AuthService.loginWithEmail(testEmail, 'WrongPassword999!')
    ).rejects.toThrow(/chưa chính xác/i)

    // 3. Non-existent email
    await expect(
      AuthService.loginWithEmail('ghost-nonexistent@example.com', testPassword)
    ).rejects.toThrow(/chưa chính xác/i)
  })

  it('automatically grants ROOT ADMIN role when registering with Kiệt’s master email', async () => {
    const result = await AuthService.registerWithEmail(
      `kiet.maianh@gmail.com`,
      'AdminSecret2026!',
      'Mai Anh Kiệt'
    )

    expect(result.user.role).toBe('admin')
    expect(result.user.displayName).toBe('Mai Anh Kiệt')

    const decoded = jwt.verify(result.token, config.jwt.secret) as { role: string }
    expect(decoded.role).toBe('admin')
  })
})

