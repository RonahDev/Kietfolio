import { PoolClient } from 'pg'
import { pool } from '../db/pool'
import { logger } from './logger'

/**
 * Executes a sequence of queries within an isolated ACID database transaction.
 * Automatically issues BEGIN, invokes the callback, executes COMMIT on success,
 * or rolls back on any thrown exception, and safely releases the connection client.
 *
 * @param callback Async function receiving an active PoolClient connection
 * @returns The resolved value of the callback
 */
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    try {
      await client.query('ROLLBACK')
      logger.warn('[Transaction Rollback]: Transaction aborted and rolled back due to error', undefined, error)
    } catch (rollbackError) {
      logger.error('[Transaction Rollback Failed]: Could not rollback transaction cleanly', rollbackError)
    }
    throw error
  } finally {
    client.release()
  }
}

