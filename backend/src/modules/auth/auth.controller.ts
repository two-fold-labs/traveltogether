import type { RequestHandler } from 'express';

import { env } from '#config/env.js';

import { AUTH_COOKIE_NAME, AUTH_TOKEN_TTL_SECONDS } from './auth.constants.js';
import { cookieSchema } from './auth.schema.js';
import * as authService from './auth.service.js';

const guestLogin: RequestHandler = async (req, res, next) => {
  try {
    const cookies = cookieSchema.safeParse(req.cookies);
    const token = cookies.success ? cookies.data.authToken : undefined;

    const result = await authService.resolveGuestSession(token);

    if (result.newToken) {
      res.cookie(AUTH_COOKIE_NAME, result.newToken, {
        maxAge: AUTH_TOKEN_TTL_SECONDS * 1000,
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'strict',
      });

      res.status(201).json({ user: result.user });

      return;
    }

    res.status(200).json({ user: result.user });
  } catch (error) {
    next(error);
  }
};

export { guestLogin };
