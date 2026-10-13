import z from 'zod';

const genreEnum = z.enum(['COMEDY']);

export const movieSchema = z.object({
	id: z.number(),
	adult: z.boolean(),
	backdropPath: z.string(),
	title: z.string(),
	originalLanguage: z.string(),
	originalTitle: z.string(),
	overview: z.string(),
	posterPath: z.string(),
	mediaType: z.string(),
	genres: z.array(genreEnum),
	popularity: z.number(),
	releaseDate: z.date(),
	video: z.boolean(),
	voteAverage: z.number(),
	voteCount: z.number(),
});
