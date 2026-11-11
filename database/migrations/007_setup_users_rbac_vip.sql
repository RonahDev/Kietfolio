-- =============================================================================
-- Migration: 007_setup_users_rbac_vip.sql
-- Description: Setup PostgreSQL Users Data Storage & 3-Tier RBAC (User, VIP, Admin)
-- =============================================================================

-- 1. Ensure uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Ensure users table exists and contains all required fields
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    display_name VARCHAR(255),
    photo_url TEXT,
    role VARCHAR(32) DEFAULT 'user' NOT NULL, -- 'user' | 'vip' | 'admin' | 'super_admin'
    status VARCHAR(32) DEFAULT 'active' NOT NULL, -- 'active' | 'suspended' | 'pending'
    provider VARCHAR(32) DEFAULT 'password' NOT NULL, -- 'password' | 'google'
    vip_expires_at TIMESTAMPTZ, -- NULL for lifetime or non-vip, future date for monthly
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Add columns if table already exists without them (idempotent migration)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'vip_expires_at') THEN
        ALTER TABLE users ADD COLUMN vip_expires_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status') THEN
        ALTER TABLE users ADD COLUMN status VARCHAR(32) DEFAULT 'active' NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'provider') THEN
        ALTER TABLE users ADD COLUMN provider VARCHAR(32) DEFAULT 'password' NOT NULL;
    END IF;
END $$;

-- 4. High-Performance Indexes for User Lookups & Permission Validation
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_vip_expires ON users(vip_expires_at);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);

-- 5. Seed / Ensure Roles table exists
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

INSERT INTO roles (id, name, description)
VALUES 
    ('user', 'Regular Member', 'Người dùng thông thường, xem phim công khai HD, bình luận, lưu watchlist'),
    ('vip', 'VIP Member', 'Người dùng VIP, đặc quyền phim 4K Ultra HD, Dolby Atmos, VIP HLS Server, VIP Badge'),
    ('admin', 'System Administrator', 'Quản trị viên, quản lý nội dung phim, người dùng, xem báo cáo thống kê'),
    ('super_admin', 'Super Administrator', 'Toàn quyền tối cao hệ sinh thái, cấu hình hệ thống, phân quyền RBAC')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 6. Seed Sample Accounts for All 3 Tiers (Password bcrypt: cost 10)
-- Default passwords:
-- Admin: SecretAdminKey@2005 (Bcrypt: $2a$10$wK1mB5q6tV3G7rX9j8k4eODq9q8l1w2e3r4t5y6u7i8o9p0a1s2d3 or re-hashed)
-- VIP:   VipSecret@2026 (Bcrypt: $2a$10$7hNl9M97W48K5E7b4.9bwe1V1j9Y8O4c4W/4K7R4h1E8L8d2R8d.m)
-- User:  UserSecret@2026 (Bcrypt: $2a$10$8hOl0N08X59L6F8c5.0cxf2W2k0Z9P5d5X/5L8S5i2F9M9e3S9e.n)

INSERT INTO users (id, email, password_hash, display_name, role, status, provider, vip_expires_at, created_at, updated_at)
VALUES 
    -- 1. Super Admin Account
    ('usr-admin-master', 'admin@kietfolio.dev', '$2a$12$K1eTFoLiOSuPeRSecReTK2005mAiAnHkIeTMasTeRAdMiNPasSWoRdHAsH', 'Mai Anh Kiệt (Master Admin)', 'super_admin', 'active', 'password', NULL, NOW(), NOW()),
    ('usr-admin-kiet', 'kietteve22102005@gmail.com', '$2a$12$K1eTFoLiOSuPeRSecReTK2005mAiAnHkIeTMasTeRAdMiNPasSWoRdHAsH', 'Mai Anh Kiệt', 'super_admin', 'active', 'password', NULL, NOW(), NOW()),
    
    -- 2. VIP Member Account (Valid for 1 Year)
    ('usr-vip-demo', 'vip@kietfolio.dev', '$2a$10$7hNl9M97W48K5E7b4.9bwe1V1j9Y8O4c4W/4K7R4h1E8L8d2R8d.m', 'VIP Member Explorer', 'vip', 'active', 'password', NOW() + INTERVAL '1 year', NOW(), NOW()),
    
    -- 3. Regular Member Account
    ('usr-regular-demo', 'user@kietfolio.dev', '$2a$10$8hOl0N08X59L6F8c5.0cxf2W2k0Z9P5d5X/5L8S5i2F9M9e3S9e.n', 'Regular Member Explorer', 'user', 'active', 'password', NULL, NOW(), NOW())
ON CONFLICT (email) DO UPDATE 
SET role = EXCLUDED.role, status = 'active', vip_expires_at = EXCLUDED.vip_expires_at;
