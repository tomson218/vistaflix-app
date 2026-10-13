import { axiosInstance } from '@/axiosInstance';
import type { MovieScreening } from '@/features/movieScreenings/types/MovieScreening';
import { useQuery } from '@tanstack/react-query';

export const useGetMovieScreeningQuery = (id: MovieScreening['id']) => {
	const getMovieScreening = async (): Promise<MovieScreening> => {
		const response = await axiosInstance.get<MovieScreening>(`/api/v1/movieScreenings/${id}`);
		const data = response.data;
		return data;
	};

	return useQuery({
		queryKey: ['movieScreening', id],
		queryFn: getMovieScreening,
		enabled: !!id,
	});
};
