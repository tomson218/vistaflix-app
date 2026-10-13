import { MovieScreeningSchema } from '@/features/movieScreenings/schemas/movieScreeningSchema';
import { orderSchema } from '@/features/orders/schemas/orderSchema';
import { z } from 'zod';

export const ticketSchema = z.object({
	id: z.number(),
	seating: z.string(),
	orderId: orderSchema.shape.id,
	movieScreeningId: MovieScreeningSchema.shape.id,
	amount: z.number().positive(),
});
