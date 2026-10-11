using FastEndpoints;
using FastEndpoints.Swagger;

namespace backend.Features.Users
{
    public class UsersGroup : Group
    {
        public UsersGroup()
        {
            Configure("/api/v1/users", ep =>
            {
                ep.Description(x => x
                    .ProducesProblemDetails(500)
                    .AutoTagOverride("Users")
                    .WithGroupName("Users"));
                ep.AllowAnonymous();
            });
        }
    }
}
