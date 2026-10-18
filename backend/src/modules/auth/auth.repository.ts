import db from '#config/db.js';

import type { User } from './auth.types.js';

const findUserById = async (userId: string) => {
  const text = `SELECT * FROM users WHERE id = $1`;
  const values = [userId];

  const result = await db.query<User>(text, values);

  return result.rows[0];
};

const createGuestUser = async (userName: string) => {
  const text = `INSERT INTO users(name, is_anonymous) VALUES($1, $2) RETURNING id, name, is_anonymous`;
  const values = [userName, true];

  const result = await db.query<Pick<User, 'id' | 'name' | 'is_anonymous'>>(
    text,
    values,
  );
  const user = result.rows[0];

  if (!user) {
    throw new Error('Failed to create guest user.');
  }

  return user;
};

export { findUserById, createGuestUser };
