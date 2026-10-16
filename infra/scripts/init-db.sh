#!/usr/bin/env bash
# Script to verify PostgreSQL readiness
set -e

echo "[Infra Check]: Waiting for PostgreSQL to be available..."
until pg_isready -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "${DB_USER:-kietfolio_user}"; do
  echo "[Infra Check]: PostgreSQL is starting up, retrying in 2 seconds..."
  sleep 2
done

echo "[Infra Check]: PostgreSQL is ready and accepting connections!"

