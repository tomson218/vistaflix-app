import type z from 'zod';
import type { movieSchema } from '@/features/movies/schemas/movieSchema';

export type Movie = z.infer<typeof movieSchema>;

export type MoviesResponse = {
	movies: Movie[];
};
