#!/usr/bin/env bash
# Health check script for Kietfolio fullstack services
set -e

echo "=== Kietfolio Fullstack Health Verification ==="

echo "1. Checking Backend API (/api/health)..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health || echo "000")
if [ "$BACKEND_STATUS" -eq 200 ]; then
  echo "✔ Backend is OPERATIONAL (HTTP 200)"
else
  echo "✖ Backend returned HTTP $BACKEND_STATUS"
fi

echo "2. Checking Frontend App..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 || echo "000")
if [ "$FRONTEND_STATUS" -eq 200 ]; then
  echo "✔ Frontend is OPERATIONAL (HTTP 200)"
else
  echo "✖ Frontend returned HTTP $FRONTEND_STATUS"
fi

echo "=== Health check completed ==="
