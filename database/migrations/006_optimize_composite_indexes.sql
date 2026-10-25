-- =============================================================================
-- Migration: 006_optimize_composite_indexes.sql
-- Description: Composite and partial index optimization for high-frequency queries
-- =============================================================================

-- 1. Guestbook query optimization:
-- Query: WHERE is_approved = true ORDER BY is_pinned DESC, created_at DESC
-- Partial index eliminates heap scans and index joins for public feeds
CREATE INDEX IF NOT EXISTS idx_guestbook_approved_pinned_created 
ON guestbook_entries (is_pinned DESC, created_at DESC) 
WHERE is_approved = true;

-- 2. Payments ledger optimization:
-- Query: WHERE status = 'pending' | 'success' ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_payments_status_created 
ON payments (status, created_at DESC);

-- 3. Users role & provider composite query optimization:
CREATE INDEX IF NOT EXISTS idx_users_provider_role 
ON users (provider, role);

