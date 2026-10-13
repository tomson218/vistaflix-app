import { axiosInstance } from '@/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { MoviesResponse } from '@/features/movies/types/Movie';

export const useGetAllMoviesQuery = () => {
	const getAllMovies = async (): Promise<MoviesResponse> => {
		const response = await axiosInstance.get<MoviesResponse>('/api/v1/movies');
		const data = response.data;
		return data;
	};

	return useQuery({
		queryKey: ['movies'],
		queryFn: getAllMovies,
	});
};
