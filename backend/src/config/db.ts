import { AsyncLocalStorage } from 'node:async_hooks';

import { Pool, type PoolClient } from 'pg';

import { env } from './env.js';

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
});

const transactionStorage = new AsyncLocalStorage<PoolClient>();

const getDb = (): Pool | PoolClient => {
  return transactionStorage.getStore() ?? pool;
};

const withTransaction = async <T>(fn: () => Promise<T>): Promise<T> => {
  const existingClient = transactionStorage.getStore();

  if (existingClient) {
    return fn();
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await transactionStorage.run(client, fn);

    await client.query('COMMIT');

    return result;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // Keep the original error; rollback failure is secondary.
    }

    throw error;
  } finally {
    client.release();
  }
};

export { getDb, withTransaction };
export default pool;
