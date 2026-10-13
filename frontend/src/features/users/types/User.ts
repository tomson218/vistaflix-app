import { z } from 'zod';
import type { userSchema } from '@/features/users/schemas/userSchema';

export type User = z.infer<typeof userSchema>;

export type UserDto = Omit<User, 'password'>;

export type UsersResponse = {
	users: UserDto[];
};
