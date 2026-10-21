import { useGetMovieByIdQuery } from '@/features/movies/api/queries/useGetMovieByIdQuery';
import { useGetMovieScreeningByIdQuery } from '@/features/movieScreenings/api/queries/useGetMovieScreeningByIdQuery';
import { useParams, useNavigate, Link } from 'react-router';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@base-ui/react';
import { Calendar, Clock, MapPin, Star, ArrowLeft, Ticket, Globe, ShieldAlert, Clapperboard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getGenreTitle } from '@/utils/genres';

const idSchema = z.coerce.number().int({ message: 'Invalid format' });

const MovieScreeningDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const result = idSchema.safeParse(id);

	if (!result.success) {
		return (
			<div className='container mx-auto px-4 py-16 text-center max-w-md'>
				<Card className='border-destructive/50 bg-destructive/5 p-6'>
					<ShieldAlert className='h-12 w-12 text-destructive mx-auto mb-3' />
					<h2 className='text-lg font-bold text-foreground'>Nieprawidłowy parametr</h2>
					<p className='text-sm text-muted-foreground mt-1 mb-4'>
						Identyfikator seansu w adresie URL jest niepoprawny.
					</p>
					<Button variant='outline' onClick={() => navigate('/')} className='w-full gap-2'>
						<ArrowLeft className='h-4 w-4' /> Powrót do repertuaru
					</Button>
				</Card>
			</div>
		);
	}

	const {
		data: movieScreening,
		isPending: isMovieScreeningPending,
		isError: isMovieScreeningError,
		error: movieScreeningError,
	} = useGetMovieScreeningByIdQuery(parseInt(id!));

	const {
		data: movieDetails,
		isPending: isMovieDetailsPending,
		isError: isMovieDetailsError,
		error: movieError,
	} = useGetMovieByIdQuery(parseInt(movieScreening?.movieId));

	if (isMovieScreeningPending || isMovieDetailsPending) {
		return <span>Loading...</span>;
	}

	const isLoading = isMovieScreeningPending || (!!movieScreening && isMovieDetailsPending);
	const isError = isMovieScreeningError || isMovieDetailsError;

	if (isMovieScreeningError || isMovieDetailsError) {
		return (
			<>
				<span>Error: {movieScreeningError?.message}</span>
				<span>Error: {movieError?.message}</span>
			</>
		);
	}

	// Loading status (Skeletons)
	if (isLoading) {
		return (
			<div className='container mx-auto max-w-6xl px-4 py-8 space-y-8'>
				<Skeleton className='h-8 w-32' />
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<Skeleton className='h-[450px] w-full rounded-2xl' />
					<div className='md:col-span-2 space-y-4'>
						<Skeleton className='h-10 w-3/4' />
						<Skeleton className='h-6 w-1/2' />
						<Skeleton className='h-32 w-full rounded-xl' />
						<Skeleton className='h-24 w-full rounded-xl' />
					</div>
				</div>
			</div>
		);
	}

	// Stan błędu
	if (isError || !movieScreening) {
		return (
			<div className='container mx-auto px-4 py-16 text-center max-w-md'>
				<Card className='p-6'>
					<Clapperboard className='h-12 w-12 text-muted-foreground mx-auto mb-3' />
					<h2 className='text-xl font-bold'>Wystąpił błąd</h2>
					<p className='text-sm text-muted-foreground mt-1 mb-4'>
						{movieScreeningError?.message || movieError?.message || 'Nie znaleziono seansu.'}
					</p>
					<Button onClick={() => navigate('/')} className='gap-2'>
						<ArrowLeft className='h-4 w-4' /> Wróć do strony głównej
					</Button>
				</Card>
			</div>
		);
	}

	// Formatting the date and time of the screening
	const screeningDate = new Date(movieScreening.screeningDateTime);
	const formattedDate = new Intl.DateTimeFormat('en', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(screeningDate);

	const formattedTime = new Intl.DateTimeFormat('en', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(screeningDate);

	// Generating a URL for a poster and background
	const getImageUrl = (path?: string) => {
		if (!path) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000';
		return path.startsWith('http') ? path : `https://image.tmdb.org/t/p/original${path}`;
	};

	return (
		<div className='min-h-screen bg-background pb-16'>
			{/* Back button */}
			<div className='container mx-auto max-w-6xl px-4 pt-6 pb-4'>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => navigate(-1)}
					className='gap-2 text-muted-foreground hover:text-foreground'>
					<ArrowLeft className='h-4 w-4' /> Back
				</Button>
			</div>

			{/* Top cinema banner with background (Hero Section) */}
			<div className='relative w-full bg-zinc-950 overflow-hidden border-b border-border/40'>
				{/* Blurred title background */}
				<div
					className='absolute inset-0 bg-cover bg-center opacity-25 blur-md scale-105'
					style={{ backgroundImage: `url(${getImageUrl(movieDetails?.backdropPath)})` }}
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent' />

				<div className='container relative mx-auto max-w-6xl px-4 py-8 md:py-12'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start'>
						{/* Film poster */}
						<div className='relative mx-auto w-full max-w-xs md:max-w-none overflow-hidden rounded-2xl shadow-2xl border border-white/10 group'>
							<img
								src={getImageUrl(movieDetails?.posterPath)}
								alt={movieDetails?.title || movieScreening.name}
								className='w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105'
							/>
							{movieDetails?.adult && (
								<Badge variant='destructive' className='absolute top-3 left-3 px-2 py-1 font-bold'>
									18+
								</Badge>
							)}
						</div>

						{/* Film and screening details */}
						<div className='md:col-span-2 space-y-6'>
							<div className='space-y-3'>
								{/* Film genres */}
								<div className='flex flex-wrap items-center gap-2'>
									{movieDetails?.genres?.map(genre => (
										<Badge
											key={genre}
											variant='secondary'
											className='bg-primary/10 text-primary border-primary/20'>
											{getGenreTitle(genre)}
										</Badge>
									))}
									{movieDetails?.originalLanguage && (
										<Badge variant='outline' className='uppercase flex items-center gap-1 text-xs'>
											<Globe className='h-3 w-3' />
											{movieDetails.originalLanguage}
										</Badge>
									)}
								</div>

								{/* Film title and screening */}
								<h1 className='text-3xl md:text-5xl font-extrabold tracking-tight text-foreground'>
									{movieDetails?.title || movieScreening.name}
								</h1>

								{movieDetails?.originalTitle && movieDetails.originalTitle !== movieDetails.title && (
									<p className='text-sm text-muted-foreground italic'>
										Original title: {movieDetails.originalTitle}
									</p>
								)}

								{/* Ratings and statistics */}
								{movieDetails?.voteAverage !== undefined && (
									<div className='flex items-center gap-3 pt-1'>
										<div className='flex items-center gap-1.5 bg-amber-500/10 text-amber-500 font-bold px-3 py-1 rounded-full border border-amber-500/20 text-sm'>
											<Star className='h-4 w-4 fill-amber-500' />
											<span>{movieDetails.voteAverage.toFixed(1)}</span>
											<span className='text-xs font-normal text-muted-foreground'>/ 10</span>
										</div>
										{movieDetails.voteCount && (
											<span className='text-xs text-muted-foreground'>
												({movieDetails.voteCount.toLocaleString('pl-PL')} votes)
											</span>
										)}
									</div>
								)}
							</div>

							<Separator />

							{/* Information on the date and venue */}
							<Card className='bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg'>
								<CardHeader className='pb-3'>
									<CardTitle className='text-lg font-semibold flex items-center gap-2 text-primary'>
										<Ticket className='h-5 w-5' />
										Screening Information
									</CardTitle>
								</CardHeader>
								<CardContent className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
									<div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50'>
										<Calendar className='h-5 w-5 text-primary shrink-0' />
										<div>
											<p className='text-xs text-muted-foreground font-medium'>Date</p>
											<p className='text-sm font-bold capitalize'>{formattedDate}</p>
										</div>
									</div>

									<div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50'>
										<Clock className='h-5 w-5 text-primary shrink-0' />
										<div>
											<p className='text-xs text-muted-foreground font-medium'>Time</p>
											<p className='text-sm font-bold'>{formattedTime}</p>
										</div>
									</div>

									<div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50'>
										<MapPin className='h-5 w-5 text-primary shrink-0' />
										<div>
											<p className='text-xs text-muted-foreground font-medium'>
												Cinema auditorium
											</p>
											<p className='text-sm font-bold'>{movieScreening.cinemaHall}</p>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Film and screening details */}
							<div className='space-y-3 pt-2'>
								<h3 className='text-lg font-semibold text-foreground'>Description of the screening</h3>
								<p className='text-muted-foreground text-sm leading-relaxed'>
									{movieScreening.description ||
										movieDetails?.overview ||
										'Brak opisu dla tego seansu.'}
								</p>
							</div>

							{/* Synopsis of the film (if different from the screening description)*/}
							{movieDetails?.overview && movieDetails.overview !== movieScreening.description && (
								<div className='space-y-2 pt-2'>
									<h4 className='text-sm font-semibold text-foreground'>The film’s plot</h4>
									<p className='text-muted-foreground text-sm leading-relaxed'>
										{movieDetails.overview}
									</p>
								</div>
							)}

							{/* Book a ticket button */}
							<div className='pt-4 flex flex-col sm:flex-row gap-4'>
								<Button size='lg' className='w-full sm:w-auto gap-2 px-8 text-base shadow-md'>
									<Ticket className='h-5 w-5' />
									Buy or Book a Ticket
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MovieScreeningDetails;
