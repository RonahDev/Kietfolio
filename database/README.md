# Kietfolio Database Management (PostgreSQL 16)

This directory contains the database schema migrations, seed data, and maintenance procedures for Kietfolio.

## Directory Structure
- `migrations/`: Sequential SQL migration scripts creating tables, indexes, constraints, and extensions.
- `seeds/`: Initial administrative, guestbook, and project records.
- `init.sql`: Automated initialization file executed by the PostgreSQL container upon initial startup.

## Local Manual Migration Execution
To execute migrations against an existing PostgreSQL instance:
```bash
# Connect and apply migrations
psql -h localhost -p 5432 -U kietfolio_user -d kietfolio_db -f migrations/001_create_users_table.sql
psql -h localhost -p 5432 -U kietfolio_user -d kietfolio_db -f migrations/002_create_guestbook_table.sql
psql -h localhost -p 5432 -U kietfolio_user -d kietfolio_db -f migrations/003_create_contact_messages_table.sql
psql -h localhost -p 5432 -U kietfolio_user -d kietfolio_db -f migrations/004_create_projects_table.sql

# Apply initial seeds
psql -h localhost -p 5432 -U kietfolio_user -d kietfolio_db -f seeds/001_seed_initial_data.sql
```

## Backup & Restore
### Dump Database
```bash
pg_dump -h localhost -U kietfolio_user -d kietfolio_db -F c -b -v -f backup_$(date +%Y%m%d).dump
```

### Restore Database
```bash
pg_restore -h localhost -U kietfolio_user -d kietfolio_db -v backup_20261015.dump
```
