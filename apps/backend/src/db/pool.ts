import { Pool } from 'pg'
import { config } from '../config/env'

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
  ssl: config.db.ssl,
  min: 2, // Pre-warm 2 active connections to eliminate cold-start TCP/TLS latency
  max: 20, // Max concurrent database connections per container instance
  idleTimeoutMillis: 30000, // Disconnect idle clients after 30 seconds
  connectionTimeoutMillis: 3000, // Fast-fail connection timeout
  allowExitOnIdle: true, // Allow Node process to gracefully exit when no queries pending
})

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('[Database Pool Error]: Unexpected error on idle client', err)
})

export async function testDbConnection(): Promise<boolean> {
  try {
    const client = await pool.connect()
    try {
      await client.query('SELECT 1')
      return true
    } finally {
      client.release()
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[Database Connection]: PostgreSQL connection currently unavailable. Using memory/fallback mode.', (error as Error).message)
    return false
  }
}
