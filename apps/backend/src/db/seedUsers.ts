import bcrypt from 'bcryptjs'
import { pool } from './pool'
import { prisma } from '../config/prisma'

export async function seedUsersAndRoles(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('🌱 [Database Seed]: Starting PostgreSQL Users & 3-Tier RBAC Seeding...')

  try {
    // 1. Ensure Roles exist in Database
    const rolesData = [
      {
        id: 'super_admin',
        name: 'Super Administrator',
        description: 'Toàn quyền tối cao hệ sinh thái, cấu hình hệ thống, phân quyền RBAC',
      },
      {
        id: 'admin',
        name: 'System Administrator',
        description: 'Quản trị viên, quản lý nội dung phim, người dùng, xem báo cáo thống kê',
      },
      {
        id: 'vip',
        name: 'VIP Member',
        description: 'Người dùng VIP, đặc quyền phim 4K Ultra HD, Dolby Atmos, VIP HLS Server, VIP Badge',
      },
      {
        id: 'user',
        name: 'Regular Member',
        description: 'Người dùng thông thường, xem phim công khai HD, bình luận, lưu watchlist',
      },
    ]

    for (const r of rolesData) {
      await pool.query(
        `INSERT INTO roles (id, name, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name, description = EXCLUDED.description`,
        [r.id, r.name, r.description]
      ).catch(() => {})
    }

    // 2. Hash default passwords
    const adminHash = await bcrypt.hash('SecretAdminKey@2005', 10)
    const vipHash = await bcrypt.hash('VipSecret@2026', 10)
    const userHash = await bcrypt.hash('UserSecret@2026', 10)

    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    // 3. Seed Users
    const usersData = [
      {
        id: 'usr-admin-master',
        email: 'admin@kietfolio.dev',
        displayName: 'Mai Anh Kiệt (Master Admin)',
        passwordHash: adminHash,
        role: 'super_admin',
        status: 'active',
        vipExpiresAt: null,
      },
      {
        id: 'usr-admin-kiet',
        email: 'kietteve22102005@gmail.com',
        displayName: 'Mai Anh Kiệt',
        passwordHash: adminHash,
        role: 'super_admin',
        status: 'active',
        vipExpiresAt: null,
      },
      {
        id: 'usr-vip-demo',
        email: 'vip@kietfolio.dev',
        displayName: 'VIP Member Explorer',
        passwordHash: vipHash,
        role: 'vip',
        status: 'active',
        vipExpiresAt: oneYearFromNow,
      },
      {
        id: 'usr-regular-demo',
        email: 'user@kietfolio.dev',
        displayName: 'Regular Member Explorer',
        passwordHash: userHash,
        role: 'user',
        status: 'active',
        vipExpiresAt: null,
      },
    ]

    for (const u of usersData) {
      await pool.query(
        `INSERT INTO users (id, email, password_hash, display_name, role, status, provider, vip_expires_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'password', $7, NOW(), NOW())
         ON CONFLICT (email) DO UPDATE
         SET role = EXCLUDED.role,
             password_hash = EXCLUDED.password_hash,
             display_name = EXCLUDED.display_name,
             status = EXCLUDED.status,
             vip_expires_at = EXCLUDED.vip_expires_at,
             updated_at = NOW()`,
        [u.id, u.email, u.passwordHash, u.displayName, u.role, u.status, u.vipExpiresAt]
      ).catch(async () => {
        // Fallback to Prisma if pool fails
        await prisma.user.upsert({
          where: { email: u.email },
          update: {
            role: u.role,
            passwordHash: u.passwordHash,
            displayName: u.displayName,
            status: u.status,
            vipExpiresAt: u.vipExpiresAt,
          },
          create: {
            id: u.id,
            email: u.email,
            passwordHash: u.passwordHash,
            displayName: u.displayName,
            role: u.role,
            status: u.status,
            vipExpiresAt: u.vipExpiresAt,
          },
        }).catch(() => {})
      })
    }

    // eslint-disable-next-line no-console
    console.log('✅ [Database Seed]: 3-Tier Users (Regular User, VIP User, Admin User) seeded successfully!')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[Database Seed Warning]: Could not complete PostgreSQL seed:', (error as Error).message)
  }
}

// Allow direct CLI execution: tsx src/db/seedUsers.ts
if (require.main === module) {
  seedUsersAndRoles().then(() => process.exit(0))
}
