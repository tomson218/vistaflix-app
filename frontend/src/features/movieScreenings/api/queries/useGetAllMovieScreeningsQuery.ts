import { axiosInstance } from '@/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { MovieScreening, MovieScreeningsResponse } from '@/features/movieScreenings/types/MovieScreening';

export const useGetAllMovieScreeningsQuery = () => {
	const getAllMovieScreenings = async (): Promise<MovieScreening[]> => {
		const response = await axiosInstance.get<MovieScreeningsResponse>('/api/v1/movieScreenings');
		const data = response.data;
		return data.movieScreenings;
	};

	return useQuery({
		queryKey: ['movieScreenings'],
		queryFn: getAllMovieScreenings,
	});
};
