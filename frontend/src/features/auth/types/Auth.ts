import z from 'zod';
import { loginSchema, registerSchema } from '../schemas/authSchema';

export type Login = z.infer<typeof loginSchema>;

export type Register = z.infer<typeof registerSchema>;

export type AuthUser = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
};
