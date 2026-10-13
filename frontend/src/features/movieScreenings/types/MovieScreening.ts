import type { MovieScreeningSchema } from '@/features/movieScreenings/schemas/movieScreeningSchema';
import { z } from 'zod';

export type MovieScreening = z.infer<typeof MovieScreeningSchema>;

export type MovieScreeningsResponse = {
	movieScreenings: MovieScreening[];
};
