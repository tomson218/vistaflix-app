using backend.Services;
using FastEndpoints;

namespace backend.Features.Auth.Logout
{
    public class LogoutEndpoint : EndpointWithoutRequest
    {
        public override void Configure()
        {
            Post("/logout");
            Group<AuthGroup>();
            AllowAnonymous();
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            AuthCookies.Clear(HttpContext);
            await Send.NoContentAsync(ct);
        }
    }
}
