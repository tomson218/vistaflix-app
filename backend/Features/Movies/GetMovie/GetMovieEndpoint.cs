using backend.Domain;
using backend.Domain.Movies;
using FastEndpoints;
using Microsoft.AspNetCore.Mvc.Formatters;

namespace backend.Features.Movies.GetMovie
{
    public record GetMovieRequest(int Id);

    public record GetMovieResponse(int Id, bool Adult, string BackdropPath, string Title, string OriginalLanguage, string OriginalTitle, string Overview, string PosterPath, 
        string MediaType, List<Genre> Genres, int Popularity, DateTime ReleaseDate, bool Video, int VoteAverage, int VoteCount);

    public class GetMovieEndpoint(VistaFlixContext db) : Endpoint<GetMovieRequest, GetMovieResponse>
    {
        public override void Configure()
        {
            Get("/{Id}");
            Group<MoviesGroup>();
        }

        public override async Task HandleAsync(GetMovieRequest request, CancellationToken ct)
        {
            var movie = await db.Movies.FindAsync(request.Id);

            if (movie == null)
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            await Send.OkAsync(new GetMovieResponse(movie.Id, movie.Adult, movie.BackdropPath, movie.Title,  movie.OriginalLanguage,  movie.OriginalTitle,  movie.Overview, 
                movie.PosterPath, movie.MediaType, movie.Genres, movie.Popularity, movie.ReleaseDate, movie.Video, movie.VoteAverage, movie.VoteCount), ct);
        }
    }
}

