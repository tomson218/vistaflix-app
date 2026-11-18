using backend.Domain;
using backend.Services;
using FastEndpoints;
using FastEndpoints.Security;

namespace backend.Features.Auth.Me
{
    public class MeEndpoint(VistaFlixContext db) : EndpointWithoutRequest<AuthUserResponse>
    {
        public override void Configure()
        {
            Get("/me");
            Group<AuthGroup>();
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            var userId = int.Parse(User.ClaimValue(TokenService.UserIdClaim)!);
            var user = await db.Users.FindAsync([userId], ct);

            if (user is null)
            {
                await Send.UnauthorizedAsync(ct);
                return;
            }

            await Send.OkAsync(AuthUserResponse.From(user), ct);
        }
    }
}
