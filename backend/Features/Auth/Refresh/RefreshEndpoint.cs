using backend.Services;
using FastEndpoints;

namespace backend.Features.Auth.Refresh
{
    public class RefreshEndpoint(TokenService tokenService) : EndpointWithoutRequest
    {
        public override void Configure()
        {
            Post("/refresh");
            Group<AuthGroup>();
            AllowAnonymous();
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            var tokens = await tokenService.RefreshAsync(HttpContext.Request.Cookies[AuthCookies.RefreshToken], ct);

            if (tokens is null)
            {
                AuthCookies.Clear(HttpContext);
                await Send.UnauthorizedAsync(ct);
                return;
            }

            AuthCookies.Append(HttpContext, tokens);
            await Send.NoContentAsync(ct);
        }
    }
}
