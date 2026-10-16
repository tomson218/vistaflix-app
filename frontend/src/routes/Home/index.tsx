import { useGetAllMovieScreeningsQuery } from '@/features/movieScreenings/api/queries/useGetAllMovieScreeningsQuery';

const Home = () => {
	const {
		data: movieScreenings,
		isPending: isMovieScreeningsPending,
		isError: isMovieScreeningsError,
	} = useGetAllMovieScreeningsQuery();

	if (isMovieScreeningsPending) {
		return <p>Loading...</p>;
	}

	console.log(movieScreenings);

	console.log(isMovieScreeningsError);

	return (
		<div>
			<h1>Home</h1>
		</div>
	);
};

export default Home;
