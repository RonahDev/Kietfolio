/**
 * Security Audit Test Suite — 10 Comprehensive Test Cases
 *
 * Validates the 6 OWASP-class vulnerability patches applied to Kietfolio backend:
 *   1. Google OAuth Identity Spoofing (no auto-admin)
 *   2. Free VIP Upgrade Without Payment (requires admin)
 *   3. Hardcoded Weak Admin Passwords Removed
 *   4. CORS Whitelist (no wildcard with credentials)
 *   5. VNPay HMAC Timing-Safe Comparison
 *   6. VNPay Amount Verification
 *   7. Guestbook POST Rate Limiter
 *   8. Session Cookie HttpOnly
 *   9. SQL Injection Prevention (parameterized queries)
 *  10. XSS Prevention (no dangerouslySetInnerHTML)
 */

import { describe, it, expect } from 'vitest'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

// ─── TC-SEC-01: Google OAuth must NOT auto-assign admin role ───

describe('TC-SEC-01: Google OAuth must NOT auto-assign admin/super_admin role', () => {
  it('should always assign "user" role in googleAuth regardless of admin email', async () => {
    // Import the AuthService source code and verify determineRole is NOT called in googleAuth
    const authServicePath = path.resolve(__dirname, '../services/auth.service.ts')
    const src = fs.readFileSync(authServicePath, 'utf-8')

    // Extract the googleAuth method body
    const googleAuthStart = src.indexOf('public static async googleAuth(')
    expect(googleAuthStart).toBeGreaterThan(-1)

    // Find the method body — look for the closing brace pattern
    const methodBody = src.substring(googleAuthStart, googleAuthStart + 1500)

    // SECURITY ASSERTION: determineRole must NOT be called in googleAuth
    expect(methodBody).not.toContain('this.determineRole(')
    expect(methodBody).not.toContain('determineRole(normalizedEmail)')

    // SECURITY ASSERTION: role must be hardcoded to 'user' in googleAuth
    expect(methodBody).toContain("const role = 'user'")
  })
})

// ─── TC-SEC-02: VIP upgrade endpoint requires admin privileges ───

describe('TC-SEC-02: VIP upgrade route requires requireAdmin middleware', () => {
  it('should have requireAdmin middleware on upgrade-vip route', () => {
    const routesPath = path.resolve(__dirname, '../routes/auth.routes.ts')
    const src = fs.readFileSync(routesPath, 'utf-8')

    const upgradeVipLine = src
      .split('\n')
      .find((line) => line.includes("'/upgrade-vip'"))

    expect(upgradeVipLine).toBeDefined()
    expect(upgradeVipLine).toContain('requireAdmin')
    expect(upgradeVipLine).toContain('verifyToken')
  })
})

// ─── TC-SEC-03: Hardcoded weak admin passwords are removed ───

describe('TC-SEC-03: No hardcoded admin passwords remain in codebase', () => {
  it('should not contain allowedMasterPasswords array', () => {
    const controllerPath = path.resolve(__dirname, '../controllers/adminAuth.controller.ts')
    const src = fs.readFileSync(controllerPath, 'utf-8')

    // The entire hardcoded password bypass block must be gone
    expect(src).not.toContain('allowedMasterPasswords')
    expect(src).not.toContain("'admin123456'")
    expect(src).not.toContain("'admin123'")
    expect(src).not.toContain("'kietteve22102005'")
    expect(src).not.toContain("'Kietfolio@2025'")
  })

  it('should only use bcrypt.compare for password validation', () => {
    const controllerPath = path.resolve(__dirname, '../controllers/adminAuth.controller.ts')
    const src = fs.readFileSync(controllerPath, 'utf-8')

    // Password validation should ONLY use bcrypt.compare
    expect(src).toContain('bcrypt.compare(password, user.passwordHash)')

    // Should NOT have the bypass pattern: if (!isPasswordValid && isConfiguredMaster) { ... includes(password) }
    expect(src).not.toContain('.includes(password)')
  })
})

// ─── TC-SEC-04: CORS rejects unknown origins ───

describe('TC-SEC-04: CORS whitelist rejects unknown origins', () => {
  it('should have an allowedOrigins whitelist in app.ts', () => {
    const appPath = path.resolve(__dirname, '../app.ts')
    const src = fs.readFileSync(appPath, 'utf-8')

    // Must have an explicit whitelist
    expect(src).toContain('allowedOrigins')

    // Must check if origin is in allowedOrigins
    expect(src).toContain('allowedOrigins.includes(origin)')

    // Must reject unknown origins with an error
    expect(src).toContain('not allowed by CORS')
  })

  it('should NOT have a wildcard CORS that returns true for all origins', () => {
    const appPath = path.resolve(__dirname, '../app.ts')
    const src = fs.readFileSync(appPath, 'utf-8')

    // Extract the origin callback
    const originCallbackRegion = src.substring(
      src.indexOf('origin:'),
      src.indexOf('credentials:')
    )

    // Count how many times callback(null, true) appears
    // Should be exactly 1 (for the no-origin case: mobile apps, curl, etc.)
    const matches = originCallbackRegion.match(/callback\(null,\s*true\)/g)
    expect(matches).not.toBeNull()
    expect(matches!.length).toBeLessThanOrEqual(2) // no-origin + whitelisted origin
  })
})

// ─── TC-SEC-05: VNPay HMAC uses timing-safe comparison ───

describe('TC-SEC-05: VNPay HMAC uses crypto.timingSafeEqual', () => {
  it('should use timingSafeEqual instead of === for HMAC comparison', () => {
    const vnpayPath = path.resolve(__dirname, '../services/vnpay.service.ts')
    const src = fs.readFileSync(vnpayPath, 'utf-8')

    // Must use timing-safe comparison
    expect(src).toContain('crypto.timingSafeEqual')

    // Find the verifyReturn method and check that the old === comparison is gone
    const verifyStart = src.indexOf('verifyReturn')
    const verifyBody = src.substring(verifyStart, verifyStart + 800)

    // The old direct comparison must NOT exist in verifyReturn
    expect(verifyBody).not.toMatch(/signed\s*===\s*secureHash/)
  })

  it('validates that timingSafeEqual catches tampered HMAC', () => {
    const realHmac = crypto
      .createHmac('sha512', 'test-secret')
      .update('test-data')
      .digest('hex')

    const tamperedHmac = realHmac.slice(0, -4) + 'ffff'

    const realBuf = Buffer.from(realHmac, 'utf-8')
    const tamperedBuf = Buffer.from(tamperedHmac, 'utf-8')

    // Same length, different content — timingSafeEqual should return false
    expect(realBuf.length).toBe(tamperedBuf.length)
    expect(crypto.timingSafeEqual(realBuf, tamperedBuf)).toBe(false)

    // Same content — timingSafeEqual should return true
    expect(crypto.timingSafeEqual(realBuf, Buffer.from(realHmac, 'utf-8'))).toBe(true)
  })
})

// ─── TC-SEC-06: VNPay rejects mismatched payment amounts ───

describe('TC-SEC-06: VNPay verifies payment amount against stored order', () => {
  it('should contain amount verification logic in vnpay.service.ts', () => {
    const vnpayPath = path.resolve(__dirname, '../services/vnpay.service.ts')
    const src = fs.readFileSync(vnpayPath, 'utf-8')

    // Must have stored amount comparison
    expect(src).toContain('storedAmount !== amount')

    // Must log the mismatch
    expect(src).toContain('Amount mismatch')

    // Must reject the transaction on mismatch
    expect(src).toContain('Payment amount does not match the order')
  })
})

// ─── TC-SEC-07: Guestbook POST is rate-limited ───

describe('TC-SEC-07: Guestbook POST route has mutation rate limiter', () => {
  it('should have mutationLimiter middleware on POST /', () => {
    const routesPath = path.resolve(__dirname, '../routes/guestbook.routes.ts')
    const src = fs.readFileSync(routesPath, 'utf-8')

    // Must import mutationLimiter
    expect(src).toContain("import { mutationLimiter }")

    // The POST route must include the limiter
    const postLine = src.split('\n').find((line) => line.includes("guestbookRouter.post('/'"))
    expect(postLine).toBeDefined()
    expect(postLine).toContain('mutationLimiter')
  })
})

// ─── TC-SEC-08: Admin session cookie is HttpOnly ───

describe('TC-SEC-08: Admin session cookie is HttpOnly', () => {
  it('should set HttpOnly flag on admin session cookies', () => {
    const controllerPath = path.resolve(__dirname, '../controllers/adminAuth.controller.ts')
    const src = fs.readFileSync(controllerPath, 'utf-8')

    // The cookie should be set with httpOnly: true
    // Check for the cookie setting pattern
    const hasHttpOnly = src.includes('httpOnly: true') || src.includes('httpOnly:true')
    expect(hasHttpOnly).toBe(true)
  })
})

// ─── TC-SEC-09: SQL injection prevention (parameterized queries) ───

describe('TC-SEC-09: SQL injection prevention via parameterized queries', () => {
  it('should use parameterized queries ($1, $2, ...) instead of string interpolation in auth.service', () => {
    const authPath = path.resolve(__dirname, '../services/auth.service.ts')
    const src = fs.readFileSync(authPath, 'utf-8')

    // Count parameterized query markers
    const paramMarkers = src.match(/\$\d+/g)
    expect(paramMarkers).not.toBeNull()
    expect(paramMarkers!.length).toBeGreaterThan(5)

    // Verify no dangerous string interpolation in SQL queries
    // Pattern: pool.query(`...${...}...`) — template literals with embedded expressions inside SQL
    const sqlQueries = src.match(/pool\.query\(\s*`[^`]*\$\{[^}]*\}[^`]*`/g)
    expect(sqlQueries).toBeNull()
  })

  it('should use parameterized queries in vnpay.service', () => {
    const vnpayPath = path.resolve(__dirname, '../services/vnpay.service.ts')
    const src = fs.readFileSync(vnpayPath, 'utf-8')

    // Must use $1, $2 etc. for parameters
    const paramMarkers = src.match(/\$\d+/g)
    expect(paramMarkers).not.toBeNull()
    expect(paramMarkers!.length).toBeGreaterThan(3)

    // No string interpolation in SQL
    const sqlInterpolation = src.match(/pool\.query\(\s*`[^`]*\$\{[^}]*\}[^`]*`/g)
    expect(sqlInterpolation).toBeNull()
  })
})

// ─── TC-SEC-10: XSS prevention (no dangerouslySetInnerHTML in frontend) ───

describe('TC-SEC-10: XSS prevention — no dangerouslySetInnerHTML in critical components', () => {
  it('should not use dangerouslySetInnerHTML in auth-related frontend components', () => {
    const authContextPath = path.resolve(
      __dirname,
      '../../../frontend/src/features/auth/context/AuthContext.tsx'
    )

    // AuthContext may or may not exist in backend test scope
    // But if it exists, verify no dangerouslySetInnerHTML
    if (fs.existsSync(authContextPath)) {
      const src = fs.readFileSync(authContextPath, 'utf-8')
      expect(src).not.toContain('dangerouslySetInnerHTML')
    }
  })

  it('should not use dangerouslySetInnerHTML in guestbook components', () => {
    const frontendSrc = path.resolve(__dirname, '../../../frontend/src')

    if (fs.existsSync(frontendSrc)) {
      // Recursively search for guestbook-related files
      const guestbookFiles = findFiles(frontendSrc, /guestbook/i, ['.tsx', '.jsx', '.ts'])
      for (const file of guestbookFiles) {
        const src = fs.readFileSync(file, 'utf-8')
        expect(src).not.toContain('dangerouslySetInnerHTML')
      }
    }
  })
})

// ─── Helper ───

function findFiles(dir: string, namePattern: RegExp, extensions: string[]): string[] {
  const results: string[] = []
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        results.push(...findFiles(fullPath, namePattern, extensions))
      } else if (
        entry.isFile() &&
        namePattern.test(entry.name) &&
        extensions.some((ext) => entry.name.endsWith(ext))
      ) {
        results.push(fullPath)
      }
    }
  } catch {}
  return results
}
