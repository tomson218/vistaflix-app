using FastEndpoints;
using FastEndpoints.Swagger;

namespace backend.Features.Auth
{
    public class AuthGroup : Group
    {
        public AuthGroup()
        {
            Configure("/api/v1/auth", ep =>
            {
                ep.Description(x => x
                    .ProducesProblemDetails(500)
                    .AutoTagOverride("Auth")
                    .WithGroupName("Auth"));
            });
        }
    }
}
