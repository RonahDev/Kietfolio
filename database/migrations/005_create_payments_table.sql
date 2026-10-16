-- Migration: 005_create_payments_table.sql
-- Description: Create payments table for VNPay QR transactions (Donations & Mentorship)

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) UNIQUE NOT NULL,
    user_uid VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    donor_name VARCHAR(255) NOT NULL,
    donor_message TEXT,
    amount NUMERIC NOT NULL,
    order_type VARCHAR(64) NOT NULL, -- 'coffee' | 'mentorship' | 'custom'
    status VARCHAR(32) DEFAULT 'pending' NOT NULL, -- 'pending' | 'success' | 'failed'
    vnp_transaction_no VARCHAR(64),
    bank_code VARCHAR(32),
    response_code VARCHAR(16),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

