import { z } from 'zod';

export const userSchema = z.object({
	id: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.email(),
	password: z.string(),
	phoneNumber: z.string(),
});
