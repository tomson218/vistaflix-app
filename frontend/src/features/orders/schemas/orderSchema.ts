import { userSchema } from '@/features/users/schemas/userSchema';
import { z } from 'zod';

export const orderSchema = z.object({
	id: z.number(),
	totalAmount: z.number(),
	userId: userSchema.shape.id,
	createdAt: z.date(),
});
