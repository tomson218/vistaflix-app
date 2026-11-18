import type { AuthUser, Register } from '../../types/Auth';
import { axiosInstance } from '@/axiosInstance';
import { useMutation } from '@tanstack/react-query';

export const useRegisterUserMutation = () => {
	const registerUser = async (credentials: Register): Promise<AuthUser> => {
		const response = await axiosInstance.post<AuthUser>('/api/v1/auth/register', credentials);
		return response.data;
	};

	return useMutation({
		mutationFn: registerUser,
	});
};
