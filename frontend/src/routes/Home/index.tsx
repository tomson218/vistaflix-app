import { useGetAllMovieScreeningsQuery } from '@/features/movieScreenings/api/queries/useGetAllMovieScreeningsQuery';
import { MovieScreeningCard } from '@/features/movieScreenings/components/MovieScreeningCard/MovieScreeningCard';
import { rangeDates } from '@/utils/rangeDates';
import { Film, Clapperboard } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const Home = () => {
	const {
		data: movieScreenings,
		isPending: isMovieScreeningsPending,
		isError: isMovieScreeningsError,
	} = useGetAllMovieScreeningsQuery();

	// We generate all dates from today up to two weeks from now
	const daysList = useMemo(() => {
		const [start, end] = rangeDates();
		const days: Date[] = [];
		let currentDate = new Date(start);

		while (currentDate <= end) {
			days.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return days;
	}, []);

	// A variable storing a formatted string representing the selected day
	const [selectedDate, setSelectedDate] = useState<string>(daysList[0].toISOString().split('T')[0]);

	// A function for comparing dates
	const isSameDay = (d1: Date, d2: Date) => {
		return (
			d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
		);
	};

	// Filtering screenings for a selected day
	const filteredScreenings = useMemo(() => {
		const activeDateObj = new Date(selectedDate);

		return movieScreenings?.filter(screening => {
			const screeningDate = new Date(screening.screeningDateTime);
			return isSameDay(screeningDate, activeDateObj);
		});
	}, [movieScreenings, selectedDate]);

	if (isMovieScreeningsPending) {
		return <p>Loading...</p>;
	}

	console.log(movieScreenings);

	console.log(isMovieScreeningsError);

	const [today, twoWeaks] = rangeDates();
	console.log(today, twoWeaks);

	return (
		<div className='container mx-auto space-y-8 px-4 py-8 max-w-7xl'>
			{/* Section heading */}
			<div className='flex flex-col gap-1 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight text-foreground flex items-center gap-2'>
						<Film className='h-8 w-8 text-primary' />
						Cinema programme
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>Browse upcoming screenings and book your seat.</p>
				</div>
				{movieScreenings && movieScreenings.length > 0 && (
					<span className='self-start sm:self-auto rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground'>
						Available screenings: {movieScreenings.length}
					</span>
				)}
			</div>

			{/* Scrollable date selection bar (Date Strip) */}
			<div className='relative'>
				<div className='flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-muted'>
					{daysList.map((date, index) => {
						const dateString = date.toISOString().split('T')[0];
						const isSelected = selectedDate === dateString;

						const dayOfWeek = new Intl.DateTimeFormat('pl-PL', { weekday: 'short' }).format(date);
						const dayMonth = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'short' }).format(
							date,
						);
						const isToday = index === 0;

						return (
							<button
								key={dateString}
								onClick={() => setSelectedDate(dateString)}
								className={`flex flex-col items-center justify-center min-w-[85px] px-3 py-2.5 rounded-xl border text-center transition-all duration-200 shrink-0 ${
									isSelected
										? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
										: 'bg-card text-card-foreground border-border hover:bg-muted/60'
								}`}>
								<span className='text-xs font-medium uppercase opacity-80'>
									{isToday ? 'Dziś' : dayOfWeek}
								</span>
								<span className='text-sm font-bold mt-0.5'>{dayMonth}</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Charging status (Skeleton) */}
			{isMovieScreeningsPending && (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
					{Array.from({ length: 8 }).map((_, index) => (
						<div
							key={index}
							className='h-[380px] w-full rounded-xl bg-muted/60 animate-pulse border border-border/50'
						/>
					))}
				</div>
			)}

			{/* State with no screenings (Empty State) */}
			{!isMovieScreeningsPending && (!movieScreenings || movieScreenings.length === 0) && (
				<div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center bg-card/50'>
					<div className='rounded-full bg-muted p-4 mb-4'>
						<Clapperboard className='h-10 w-10 text-muted-foreground' />
					</div>
					<h3 className='text-xl font-semibold text-foreground'>No screenings scheduled</h3>
					<p className='text-muted-foreground text-sm mt-1 max-w-sm'>
						There are currently no screenings available in the programme. Please check back later.
					</p>
				</div>
			)}

			{/* Grid of session cards (Grid) */}
			{!isMovieScreeningsPending && movieScreenings && movieScreenings.length > 0 && (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
					{movieScreenings.map(screening => (
						<MovieScreeningCard movieScreening={screening} key={screening.id} />
					))}
				</div>
			)}

			{/* A carousel of screenings */}
			{!isMovieScreeningsPending && filteredScreenings?.length > 0 && (
				<Carousel
					opts={{
						align: 'start',
						loop: false,
					}}
					className='w-full relative px-10 md:px-12' // Side margins for buttons
				>
					<CarouselContent className='-ml-4 py-2'>
						{filteredScreenings?.map(screening => (
							<CarouselItem
								key={screening.id}
								className='pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4'>
								<MovieScreeningCard movieScreening={screening} />
							</CarouselItem>
						))}
					</CarouselContent>

					{/* Navigation buttons on the left and right (wings) */}
					<CarouselPrevious className='absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-md hover:bg-background' />
					<CarouselNext className='absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-md hover:bg-background' />
				</Carousel>
			)}
		</div>
	);
};

export default Home;
