-- Migration: 004_create_projects_table.sql
-- Description: Create projects table with bilingual metadata

CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle JSONB NOT NULL,
    category VARCHAR(64) NOT NULL,
    status_badge JSONB NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    problem_statement JSONB NOT NULL,
    solution_architecture JSONB NOT NULL,
    key_engineering_decisions JSONB NOT NULL,
    tech_stack TEXT[] NOT NULL,
    github_url TEXT NOT NULL,
    live_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

