using FastEndpoints;
using FastEndpoints.Swagger;

namespace backend.Features.Movies
{
    public class MoviesGroup : Group
    {
        public MoviesGroup()
        {
            Configure("/api/v1/movies", ep =>
            {
                ep.Description(x => x
                    .ProducesProblemDetails(500)
                    .AutoTagOverride("Movies")
                    .WithGroupName("Movies"));
                ep.AllowAnonymous();
            });
        }
    }
}
