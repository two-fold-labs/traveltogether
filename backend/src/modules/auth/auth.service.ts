import jwt from 'jsonwebtoken';

import { env } from '#config/env.js';

import {
  AUTH_TOKEN_TTL_SECONDS,
  GUEST_NAME,
  JWT_ALGORITHM,
} from './auth.constants.js';
import { createGuestUser, findUserById } from './auth.repository.js';
import { jwtPayloadSchema } from './auth.schema.js';
import type { PublicUser, User } from './auth.types.js';

const signAuthToken = (userId: string): string => {
  return jwt.sign({ userId }, env.jwtToken, {
    algorithm: JWT_ALGORITHM,
    expiresIn: AUTH_TOKEN_TTL_SECONDS,
  });
};

const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, env.jwtToken, {
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

// Reuses a valid session, otherwise creates a guest and issues a new token
const resolveGuestSession = async (token: string | undefined) => {
  if (token) {
    const userId = getUserIdFromToken(token);

    if (userId) {
      const user = await findUserById(userId);

      if (user) {
        return { user: toPublicUser(user), newToken: null };
      }
    }
  }

  const user = await createGuestUser(GUEST_NAME);

  return { user: toPublicUser(user), newToken: signAuthToken(user.id) };
};

export { resolveGuestSession };
