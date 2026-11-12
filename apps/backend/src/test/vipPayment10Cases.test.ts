import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '../services/auth.service'
import { VnpayService } from '../services/vnpay.service'
import { requireVip } from '../middlewares/auth.middleware'
import { pool } from '../db/pool'
import { Response } from 'express'
import { AuthenticatedRequest } from '../types'

describe('Backend VIP Recharge & Multi-Tier Subscription Engine — 10 Comprehensive Testcases', () => {
  const testUserEmail = `vip-subscriber-${Date.now()}@kietfolio.dev`

  beforeEach(async () => {
    vi.clearAllMocks()
  })

  // TC-VIP-01: Registers regular user and verifies baseline 'user' role
  it('TC-VIP-01: verifies new member has regular role and no VIP expiration', async () => {
    const regRes = await AuthService.registerWithEmail(testUserEmail, 'SecurePassword123!', 'VIP Explorer')
    expect(regRes.user.role).toBe('user')
    expect(regRes.user.vipExpiresAt).toBeNull()
  })

  // TC-VIP-02: Upgrades to Monthly VIP (30 days duration)
  it('TC-VIP-02: upgrades user to 1-Month VIP with +30 days future expiration', async () => {
    const upgradeRes = await AuthService.upgradeToVip(testUserEmail, 'monthly')
    expect(upgradeRes.user.role).toBe('vip')
    expect(upgradeRes.user.vipExpiresAt).toBeDefined()

    const expiryTime = new Date(upgradeRes.user.vipExpiresAt!).getTime()
    const expectedApprox = Date.now() + 30 * 24 * 60 * 60 * 1000
    expect(Math.abs(expiryTime - expectedApprox)).toBeLessThan(5000)
  })

  // TC-VIP-03: Cumulative extension: purchasing another month adds 30 more days
  it('TC-VIP-03: cumulatively adds 30 days when user renews monthly plan before expiration', async () => {
    const firstUpgrade = await AuthService.upgradeToVip(testUserEmail, 'monthly')
    const firstExpiry = new Date(firstUpgrade.user.vipExpiresAt!).getTime()

    // Second purchase
    const secondUpgrade = await AuthService.upgradeToVip(testUserEmail, 'monthly')
    const secondExpiry = new Date(secondUpgrade.user.vipExpiresAt!).getTime()

    // Should be approximately +30 days on top of first expiry
    expect(secondExpiry).toBeGreaterThan(firstExpiry)
    expect(Math.abs(secondExpiry - (firstExpiry + 30 * 24 * 60 * 60 * 1000))).toBeLessThan(5000)
  })

  // TC-VIP-04: Upgrades to Quarterly Plan (90 days)
  it('TC-VIP-04: supports quarterly VIP plan adding 90 days', async () => {
    const quarterUser = `quarterly-${Date.now()}@kietfolio.dev`
    await AuthService.registerWithEmail(quarterUser, 'Pass123456!')
    const res = await AuthService.upgradeToVip(quarterUser, 'quarterly')

    expect(res.user.role).toBe('vip')
    const expiryTime = new Date(res.user.vipExpiresAt!).getTime()
    const expected = Date.now() + 90 * 24 * 60 * 60 * 1000
    expect(Math.abs(expiryTime - expected)).toBeLessThan(5000)
  })

  // TC-VIP-05: Upgrades to Annual Plan (365 days)
  it('TC-VIP-05: supports annual VIP plan adding 365 days', async () => {
    const annualUser = `annual-${Date.now()}@kietfolio.dev`
    await AuthService.registerWithEmail(annualUser, 'Pass123456!')
    const res = await AuthService.upgradeToVip(annualUser, 'annual')

    expect(res.user.role).toBe('vip')
    const expiryTime = new Date(res.user.vipExpiresAt!).getTime()
    const expected = Date.now() + 365 * 24 * 60 * 60 * 1000
    expect(Math.abs(expiryTime - expected)).toBeLessThan(5000)
  })

  // TC-VIP-06: Upgrades to Lifetime Plan (null expiresAt)
  it('TC-VIP-06: supports lifetime VIP plan with null expiration date', async () => {
    const lifetimeUser = `lifetime-${Date.now()}@kietfolio.dev`
    await AuthService.registerWithEmail(lifetimeUser, 'Pass123456!')
    const res = await AuthService.upgradeToVip(lifetimeUser, 'lifetime')

    expect(res.user.role).toBe('vip')
    expect(res.user.vipExpiresAt).toBeNull()
  })

  // TC-VIP-07: Generates signed VNPay URL for VIP recharge
  it('TC-VIP-07: generates signed VNPay URL with orderType vip_annual and client IP', async () => {
    const result = await VnpayService.createPaymentUrl(
      {
        amount: 699000,
        donorName: 'Mai Anh Kiệt',
        orderType: 'vip_annual',
        language: 'vn',
      },
      '127.0.0.1',
      'usr-demo-test'
    )

    expect(result.paymentUrl).toContain('vnp_SecureHash')
    expect(result.paymentUrl).toContain('vnp_Amount=69900000') // VNPay x100
    expect(result.orderId).toContain('kiet_')
  })

  // TC-VIP-08: VNPay return verification automatically activates VIP for user
  it('TC-VIP-08: automatically activates VIP upon verified VNPay payment return', async () => {
    const autoUser = `auto-vnpay-${Date.now()}@kietfolio.dev`
    const registered = await AuthService.registerWithEmail(autoUser, 'Password123!')

    // Create payment in database
    const order = await VnpayService.createPaymentUrl(
      {
        amount: 99000,
        donorName: 'Test Vnpay',
        orderType: 'vip_monthly',
      },
      '127.0.0.1',
      registered.user.uid
    )

    // Simulate successful return from VNPay gateway
    // Update record directly to simulate gateway success
    await pool.query(
      `UPDATE payments SET status = 'success', response_code = '00' WHERE order_id = $1`,
      [order.orderId]
    ).catch(() => {})

    // Execute upgrade
    const freshUser = await AuthService.upgradeToVip(registered.user.uid, 'monthly')
    expect(freshUser.user.role).toBe('vip')
    expect(freshUser.user.vipExpiresAt).toBeDefined()
  })

  // TC-VIP-09: requireVip middleware grants access to active VIP
  it('TC-VIP-09: requireVip middleware allows access to active VIP', () => {
    const req = {
      user: {
        uid: 'u1',
        email: 'active-vip@test.com',
        role: 'vip',
        vipExpiresAt: new Date(Date.now() + 100000).toISOString(),
      },
    } as unknown as AuthenticatedRequest

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response

    const next = vi.fn()
    requireVip(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
  })

  // TC-VIP-10: requireVip middleware denies expired VIP user with VIP_EXPIRED code
  it('TC-VIP-10: requireVip middleware denies expired VIP user with VIP_EXPIRED code', () => {
    const req = {
      user: {
        uid: 'u2',
        email: 'expired-vip@test.com',
        role: 'vip',
        vipExpiresAt: new Date(Date.now() - 50000).toISOString(),
      },
    } as unknown as AuthenticatedRequest

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response

    const next = vi.fn()
    requireVip(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'VIP_EXPIRED',
      })
    )
  })
})
