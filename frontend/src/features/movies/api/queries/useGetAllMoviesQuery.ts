import { axiosInstance } from '@/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { MoviesResponse, Movie } from '@/features/movies/types/Movie';

export const useGetAllMoviesQuery = () => {
	const getAllMovies = async (): Promise<Movie[]> => {
		const response = await axiosInstance.get<MoviesResponse>('/api/v1/movies');
		const data = response.data;
		return data.movies;
	};

	return useQuery({
		queryKey: ['movies'],
		queryFn: getAllMovies,
	});
};
