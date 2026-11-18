import { userSchema } from '@/features/users/schemas/userSchema';

export const registerSchema = userSchema.omit({ id: true });

export const loginSchema = userSchema.pick({ email: true, password: true });
