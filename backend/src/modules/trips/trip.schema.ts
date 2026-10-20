import * as z from 'zod';

const createTripSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100),
    destinationPlaceId: z.string().trim().min(1),
    arriveBy: z.coerce.date(),
  })
  .refine((data) => data.arriveBy > new Date(), {
    error: 'ArriveBy must be in future',
    path: ['arriveBy'],
  });

const getTripSchema = z.object({
  tripId: z.string().trim().min(1).max(12),
});

export type GetTripParams = z.infer<typeof getTripSchema>;

export type CreateTripBody = z.infer<typeof createTripSchema>;

export { createTripSchema, getTripSchema };
