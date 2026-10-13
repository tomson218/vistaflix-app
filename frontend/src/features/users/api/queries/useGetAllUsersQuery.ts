import { axiosInstance } from '@/axiosInstance';
import type { UsersResponse } from '@/features/users/types/User';
import { useQuery } from '@tanstack/react-query';

export const useGetAllUsersQuery = () => {
	const getAllUsers = async (): Promise<UsersResponse> => {
		const response = await axiosInstance.get<UsersResponse>('/api/v1/users');
		const data = response.data;
		return data;
	};

	return useQuery({
		queryKey: ['users'],
		queryFn: getAllUsers,
	});
};
