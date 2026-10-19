import * as z from 'zod';

const cookieSchema = z.object({
  authToken: z.string().min(1).optional(),
});

const jwtPayloadSchema = z.object({
  userId: z.uuid(),
});

export type Cookie = z.infer<typeof cookieSchema>;

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export { cookieSchema, jwtPayloadSchema };
