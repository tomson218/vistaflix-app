import { movieSchema } from '@/features/movies/schemas/movieSchema';
import { z } from 'zod';

export const MovieScreeningSchema = z.object({
	id: z.number(),
	movieId: movieSchema.shape.id,
	name: z.string(),
	description: z.string(),
	cinemaHall: z.string(),
	screeningDateTime: z.date(),
});
