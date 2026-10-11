using FastEndpoints;
using FastEndpoints.Swagger;

namespace backend.Features.MovieScreenings
{
    public class MovieScreeningsGroup : Group
    {
        public MovieScreeningsGroup()
        {
            Configure("/api/v1/movieScreenings", ep =>
            {
                ep.Description(x => x
                    .ProducesProblemDetails(500)
                    .AutoTagOverride("MovieScreenings")
                    .WithGroupName("MovieScreenings"));
                ep.AllowAnonymous();
            });
        }
    }
}
