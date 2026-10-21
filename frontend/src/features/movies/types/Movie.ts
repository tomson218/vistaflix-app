import type z from 'zod';
import type { movieSchema } from '@/features/movies/schemas/movieSchema';
import type { genreEnum } from '@/features/movies/schemas/movieSchema';

export type Genre = z.infer<typeof genreEnum>;

export type Movie = z.infer<typeof movieSchema>;

export type MoviesResponse = {
	movies: Movie[];
};
