using backend.Domain;
using backend.Domain.Movies;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using static backend.Features.Movies.GetAllMovies.GetAllMoviesEndpoint;

namespace backend.Features.Movies.GetAllMovies
{
    public class GetAllMoviesEndpoint(VistaFlixContext db) : EndpointWithoutRequest<GetAllMoviesResponse>
    {
        public record GetAllMoviesResponse(List<GetAllMoviesResponse.MovieDto> Movies)
        {

        public record MovieDto(int Id, bool Adult, string BackdropPath, string Title, string OriginalLanguage, string OriginalTitle, string Overview, string PosterPath,
        string MediaType, List<Genre> Genres, int Popularity, DateTime ReleaseDate, bool Video, int VoteAverage, int VoteCount);
        }

        public override void Configure()
        {
            Get("");
            Group<MoviesGroup>();
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            var moviesList = await db.Movies
            .Select(m => new GetAllMoviesResponse.MovieDto(m.Id, m.Adult, m.BackdropPath, m.Title, m.OriginalLanguage, m.OriginalTitle, m.Overview, m.PosterPath, 
            m.MediaType, m.Genres, m.Popularity, m.ReleaseDate, m.Video, m.VoteAverage, m.VoteCount))
            .ToListAsync(ct);


            await Send.OkAsync(new GetAllMoviesResponse(moviesList), ct);
        }
    }

}
