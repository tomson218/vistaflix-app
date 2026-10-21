import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { MovieScreening } from '../../types/MovieScreening';
import { Link } from 'react-router';
import { Calendar, Clock, MapPin, Film } from 'lucide-react';

export const MovieScreeningCard = ({ movieScreening }: { movieScreening: MovieScreening }) => {
	const screeningDate = new Date(movieScreening.screeningDateTime);

	const formattedDate = new Intl.DateTimeFormat('pl-PL', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(screeningDate);

	const formattedTime = new Intl.DateTimeFormat('pl-PL', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(screeningDate);

	return (
		<Card className='flex flex-col justify-between group relative w-full max-w-sm overflow-hidden pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
			{/* Górna sekcja z grafiką i nakładką */}
			<div className='relative aspect-[16/9] w-full overflow-hidden bg-zinc-900'>
				{/* Gradient dla czytelności napisów */}
				<div className='absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />

				<img
					src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop'
					alt={movieScreening.name}
					className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
				/>

				{/* Badge z salą kinową w prawym górnym rogu */}
				<div className='absolute top-3 right-3 z-20'>
					<Badge
						variant='secondary'
						className='flex items-center gap-1.5 border-white/10 bg-black/60 px-3 py-1 text-white backdrop-blur-md'>
						<MapPin className='h-3.5 w-3.5 text-primary' />
						<span>{movieScreening.cinemaHall}</span>
					</Badge>
				</div>

				{/* Data i godzina w dolnej części grafiki */}
				<div className='absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2 text-xs font-medium text-white/90'>
					<div className='flex items-center gap-1 rounded-md border border-white/10 bg-black/50 px-2.5 py-1 backdrop-blur-md'>
						<Calendar className='h-3.5 w-3.5 text-primary' />
						<span>{formattedDate}</span>
					</div>
					<div className='flex items-center gap-1 rounded-md border border-white/10 bg-black/50 px-2.5 py-1 backdrop-blur-md'>
						<Clock className='h-3.5 w-3.5 text-primary' />
						<span>{formattedTime}</span>
					</div>
				</div>
			</div>

			{/* Treść karty */}
			<CardHeader className='flex-1 pb-3'>
				<CardTitle className='line-clamp-1 text-xl font-bold tracking-tight'>{movieScreening.name}</CardTitle>
				<CardDescription className='line-clamp-2 pt-1 text-sm text-muted-foreground'>
					{movieScreening.description}
				</CardDescription>
			</CardHeader>

			{/* Stopka z przyciskiem akcji */}
			<CardFooter className='pt-0'>
				<Link to={`/movie-screening-details/${movieScreening.id}`} className='w-full'>
					<Button className='w-full gap-2 shadow-sm'>
						<Film className='h-4 w-4' />
						Szczegóły seansu
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};
