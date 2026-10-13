import { axiosInstance } from '@/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { MovieScreeningsResponse } from '@/features/movieScreenings/types/MovieScreening';

export const useGetAllMovieScreeningsQuery = () => {
	const getAllMovieScreenings = async (): Promise<MovieScreeningsResponse> => {
		const response = await axiosInstance.get<MovieScreeningsResponse>('/api/v1/movieScreenings');
		const data = response.data;
		return data;
	};

	return useQuery({
		queryKey: ['movieScreenings'],
		queryFn: getAllMovieScreenings,
	});
};
