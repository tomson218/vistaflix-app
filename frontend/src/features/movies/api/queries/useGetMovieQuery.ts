import { axiosInstance } from '@/axiosInstance';
import type { Movie } from '@/features/movies/types/Movie';
import { useQuery } from '@tanstack/react-query';

export const useGetMovieQuery = (id: Movie['id']) => {
	const getMovie = async (): Promise<Movie> => {
		const response = await axiosInstance.get<Movie>(`/api/v1/movie/${id}`);
		const data = response.data;
		return data;
	};

	return useQuery({
		queryKey: ['movie', id],
		queryFn: getMovie,
		enabled: !!id,
	});
};
