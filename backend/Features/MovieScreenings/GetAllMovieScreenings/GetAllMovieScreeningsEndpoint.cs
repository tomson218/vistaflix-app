using backend.Domain;
using backend.Domain.MovieScreenings;
using backend.Features.MovieScreenings;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.MovieScreenings.GetAllMovieScreenings
{
    public record GetAllMovieScreeningsResponse(List <GetAllMovieScreeningsResponse.MovieScreeningDto> MovieScreenings)
    {
        public record MovieScreeningDto(int Id, int MovieId, string Name, string Description, string CinemaHall, DateTime ScreeningDateTime);
    }

    public class GetAllMovieScreeningsEndpoint(VistaFlixContext db) : EndpointWithoutRequest<GetAllMovieScreeningsResponse>
    {
        public override void Configure()
        {
            Get("");
            Group<MovieScreeningsGroup>();
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            var movieScreeningsList = await db.MovieScreenings
                .Select(ms => new GetAllMovieScreeningsResponse.MovieScreeningDto(ms.Id, ms.MovieId, ms.Name, ms.Description, ms.CinemaHall, ms.ScreeningDateTime))
                .ToListAsync(ct);

            await Send.OkAsync(new GetAllMovieScreeningsResponse(movieScreeningsList), ct);
        }

    }
}
