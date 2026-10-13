import { axiosInstance } from '@/axiosInstance';
import type { User, UserDto } from '@/features/users/types/User';
import { useQuery } from '@tanstack/react-query';

export const useGetUserByIdQuery = (id: User['id']) => {
	const getUserById = async (): Promise<UserDto> => {
		const response = await axiosInstance.get<UserDto>(`/api/v1/users/${id}`);
		const data = response.data;
		return data;
	};

	return useQuery({
		queryKey: [`userId`, id],
		queryFn: getUserById,
		enabled: !!id,
	});
};
