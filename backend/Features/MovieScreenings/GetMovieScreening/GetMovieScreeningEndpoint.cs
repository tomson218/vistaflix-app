using backend.Domain;
using backend.Domain.Movies;
using backend.Domain.MovieScreenings;
using backend.Features.MovieScreenings;
using FastEndpoints;
using System.Xml.Linq;

namespace backend.Features.MovieScreenings.GetMovieScreening
{
    public record GetMovieScreeningRequest(int Id);

    public record GetMovieScreeningResponse(int Id, int MovieId, string Name, string Description, string CinemaHall, DateTime ScreeningDateTime);

    public class GetMovieScreeningEndpoint(VistaFlixContext db) : Endpoint<GetMovieScreeningRequest, GetMovieScreeningResponse>
    {
        public override void Configure()
        {
            Get("/{Id}");
            Group<MovieScreeningsGroup>();
        }

        public override async Task HandleAsync(GetMovieScreeningRequest req, CancellationToken ct)
        {
            var movieScreening = await db.MovieScreenings.FindAsync(req.Id);

            if (movieScreening == null)
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            await Send.OkAsync(new GetMovieScreeningResponse(movieScreening.Id, movieScreening.MovieId, movieScreening.Name, movieScreening.Description, 
                movieScreening.CinemaHall, movieScreening.ScreeningDateTime), ct);
        }
    }
}
