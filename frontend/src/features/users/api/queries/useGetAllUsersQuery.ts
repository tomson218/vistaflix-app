import { axiosInstance } from '@/axiosInstance';
import type { UserDto, UsersResponse } from '@/features/users/types/User';
import { useQuery } from '@tanstack/react-query';

export const useGetAllUsersQuery = () => {
	const getAllUsers = async (): Promise<UserDto[]> => {
		const response = await axiosInstance.get<UsersResponse>('/api/v1/users');
		const data = response.data;
		return data.users;
	};

	return useQuery({
		queryKey: ['users'],
		queryFn: getAllUsers,
	});
};
