import { randomInt } from 'node:crypto';

import jwt from 'jsonwebtoken';

import { env } from '#config/env.js';

import {
  AUTH_TOKEN_TTL_SECONDS,
  GUEST_NAME,
  GUEST_NAME_SUFFIX_DIGITS,
  JWT_ALGORITHM,
} from './auth.constants.js';
import { createGuestUser, findUserById } from './auth.repository.js';
import { jwtPayloadSchema } from './auth.schema.js';
import type { PublicUser, User } from './auth.types.js';

const signAuthToken = (userId: string): string => {
  return jwt.sign({ userId }, env.jwtSecret, {
    algorithm: JWT_ALGORITHM,
    expiresIn: AUTH_TOKEN_TTL_SECONDS,
  });
};

const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, env.jwtSecret, {
      algorithms: [JWT_ALGORITHM],
    });
    const parsed = jwtPayloadSchema.safeParse(decoded);

    return parsed.success ? parsed.data.userId : null;
  } catch {
    // Token expired, tampered
    return null;
  }
};

const toPublicUser = (
  user: Pick<User, 'id' | 'name' | 'is_anonymous'>,
): PublicUser => {
  return {
    id: user.id,
    name: user.name,
    isAnonymous: user.is_anonymous,
  };
};

const generateGuestName = (): string => {
  const suffix = randomInt(10 ** GUEST_NAME_SUFFIX_DIGITS)
    .toString()
    .padStart(GUEST_NAME_SUFFIX_DIGITS, '0');

  return `${GUEST_NAME} ${suffix}`;
};

const verifyTokenAndGetUser = async (token: string) => {
  const userId = getUserIdFromToken(token);

  if (userId) {
    const user = await findUserById(userId);

    if (user) {
      return toPublicUser(user);
    }
  }

  return null;
};

// Reuses a valid session, otherwise creates a guest and issues a new token
const resolveGuestSession = async (token: string | undefined) => {
  if (token) {
    const user = await verifyTokenAndGetUser(token);

    if (user) {
      return { user, newToken: null };
    }
  }

  const user = await createGuestUser(generateGuestName());

  return { user: toPublicUser(user), newToken: signAuthToken(user.id) };
};

export { resolveGuestSession, verifyTokenAndGetUser };
