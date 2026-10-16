-- Migration: 002_create_guestbook_table.sql
-- Description: Create guestbook entries table with moderation flags and pinning

CREATE TABLE IF NOT EXISTS guestbook_entries (
    id VARCHAR(64) PRIMARY KEY,
    user_uid VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    role_title VARCHAR(255),
    message TEXT NOT NULL,
    is_google_verified BOOLEAN DEFAULT false NOT NULL,
    is_pinned BOOLEAN DEFAULT false NOT NULL,
    is_approved BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guestbook_pinned ON guestbook_entries(is_pinned DESC);

