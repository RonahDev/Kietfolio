import { describe, it, expect, vi } from 'vitest'
import { AuthService } from '../services/auth.service'
import { requireVip, requireAdmin, requireRole } from '../middlewares/auth.middleware'
import jwt from 'jsonwebtoken'
import { config } from '../config/env'
import { AuthenticatedRequest } from '../types'
import { Response } from 'express'

describe('Backend Auth & Identity Management Unit & Security Tests', () => {
  const testEmail = `tester-${Date.now()}@domain.com`
  const testPassword = 'SecurePassword123!'

  const createMockReqRes = (user?: any) => {
    const req = {
      user,
      headers: {},
    } as unknown as AuthenticatedRequest

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response

    const next = vi.fn()
    return { req, res, next }
  }

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

  it('upgrades regular user to VIP lifetime and generates VIP token', async () => {
    const upgradeRes = await AuthService.upgradeToVip(testEmail, 'lifetime')
    expect(upgradeRes.user.role).toBe('vip')
    expect(upgradeRes.user.vipExpiresAt).toBeNull()

    const decoded = jwt.verify(upgradeRes.token, config.jwt.secret) as { role: string }
    expect(decoded.role).toBe('vip')
  })

  it('upgrades regular user to VIP monthly with future expiration date', async () => {
    const tempEmail = `monthly-vip-${Date.now()}@domain.com`
    await AuthService.registerWithEmail(tempEmail, 'Password123!')
    const upgradeRes = await AuthService.upgradeToVip(tempEmail, 'monthly')

    expect(upgradeRes.user.role).toBe('vip')
    expect(upgradeRes.user.vipExpiresAt).toBeDefined()
    expect(new Date(upgradeRes.user.vipExpiresAt!).getTime()).toBeGreaterThan(Date.now())
  })

  it('requireVip middleware allows VIP users and denies regular users', () => {
    // VIP user
    const { req: vipReq, res: vipRes, next: vipNext } = createMockReqRes({
      uid: 'u_vip',
      email: 'vip@domain.com',
      role: 'vip',
    })
    requireVip(vipReq, vipRes, vipNext)
    expect(vipNext).toHaveBeenCalledTimes(1)

    // Regular user
    const { req: regReq, res: regRes, next: regNext } = createMockReqRes({
      uid: 'u_reg',
      email: 'reg@domain.com',
      role: 'user',
    })
    requireVip(regReq, regRes, regNext)
    expect(regNext).not.toHaveBeenCalled()
    expect(regRes.status).toHaveBeenCalledWith(403)
  })

  it('requireVip middleware denies expired VIP user', () => {
    const pastDate = new Date(Date.now() - 100000).toISOString()
    const { req, res, next } = createMockReqRes({
      uid: 'u_expired',
      email: 'expired@domain.com',
      role: 'vip',
      vipExpiresAt: pastDate,
    })
    requireVip(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(403)
  })

  it('requireAdmin middleware allows Admin and blocks regular/VIP users', () => {
    // Master admin email
    const { req: adminReq, res: adminRes, next: adminNext } = createMockReqRes({
      uid: 'u_admin',
      email: config.admin.email,
      role: 'admin',
    })
    requireAdmin(adminReq, adminRes, adminNext)
    expect(adminNext).toHaveBeenCalledTimes(1)

    // VIP user trying admin route
    const { req: vipReq, res: vipRes, next: vipNext } = createMockReqRes({
      uid: 'u_vip',
      email: 'vip@domain.com',
      role: 'vip',
    })
    requireAdmin(vipReq, vipRes, vipNext)
    expect(vipNext).not.toHaveBeenCalled()
    expect(vipRes.status).toHaveBeenCalledWith(403)
  })

  it('requireRole middleware validates specific role tiers correctly', () => {
    const requireVipOrAdmin = requireRole('vip', 'admin')

    const { req: vipReq, res: vipRes, next: vipNext } = createMockReqRes({
      uid: 'u_vip',
      email: 'vip@domain.com',
      role: 'vip',
    })
    requireVipOrAdmin(vipReq, vipRes, vipNext)
    expect(vipNext).toHaveBeenCalledTimes(1)

    const { req: userReq, res: userRes, next: userNext } = createMockReqRes({
      uid: 'u_user',
      email: 'user@domain.com',
      role: 'user',
    })
    requireVipOrAdmin(userReq, userRes, userNext)
    expect(userNext).not.toHaveBeenCalled()
    expect(userRes.status).toHaveBeenCalledWith(403)
  })
})
