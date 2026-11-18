import { axiosInstance } from '@/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import type { AuthUser, Login } from '../../types/Auth';

export const useLoginUserMutation = () => {
	const loginUser = async (credentials: Login): Promise<AuthUser> => {
		const response = await axiosInstance.post<AuthUser>('/api/v1/auth/login', credentials);
		return response.data;
	};

	return useMutation({
		mutationFn: loginUser,
	});
};
