-- =============================================================================
-- Kietfolio PostgreSQL Automatic Database Initialization
-- =============================================================================

\echo 'Executing Migration 001: Users Table...'
\i /docker-entrypoint-initdb.d/migrations/001_create_users_table.sql

\echo 'Executing Migration 002: Guestbook Table...'
\i /docker-entrypoint-initdb.d/migrations/002_create_guestbook_table.sql

\echo 'Executing Migration 003: Contact Messages Table...'
\i /docker-entrypoint-initdb.d/migrations/003_create_contact_messages_table.sql

\echo 'Executing Migration 004: Projects Table...'
\i /docker-entrypoint-initdb.d/migrations/004_create_projects_table.sql

\echo 'Executing Migration 005: Payments Table...'
\i /docker-entrypoint-initdb.d/migrations/005_create_payments_table.sql

\echo 'Executing Migration 006: High-Performance Composite & Partial Indexes...'
\i /docker-entrypoint-initdb.d/migrations/006_optimize_composite_indexes.sql

\echo 'Executing Seeds: Initial Database Content...'
\i /docker-entrypoint-initdb.d/seeds/001_seed_initial_data.sql

\echo 'Kietfolio Database Initialized Successfully!'
