import type { Genre } from '@/features/movies/types/Movie';

export const getGenreTitle = (genre: Genre): string => {
	const genreMap: Record<Genre | number, string> = {
		COMEDY: 'Comedy',
		0: 'Comedy',
		ACTION: 'Action',
		1: 'Action',
		DRAMA: 'Drama',
		2: 'Drama',
		HORROR: 'Horror',
		3: 'Horror',
		SCI_FI: 'Sci-Fi',
		4: 'Sci-Fi',
		ROMANCE: 'Romance',
		5: 'Romance',
		THRILLER: 'Thriller',
		6: 'Thriller',
		ANIMATION: 'Animation',
		7: 'Animation',
	};

	return genreMap[genre] || String(genre);
};
