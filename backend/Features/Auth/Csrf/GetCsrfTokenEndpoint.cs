using backend.Services;
using FastEndpoints;

namespace backend.Features.Auth.Csrf
{
    public record CsrfTokenResponse(string Token);

    public class GetCsrfTokenEndpoint(CsrfTokenService csrfTokenService) : EndpointWithoutRequest<CsrfTokenResponse>
    {
        public override void Configure()
        {
            Get("/csrf");
            Group<AuthGroup>();
            AllowAnonymous();
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            var token = HttpContext.Request.Cookies[AuthCookies.CsrfToken];

            if (!csrfTokenService.IsAuthentic(token))
            {
                token = csrfTokenService.Create();
                AuthCookies.AppendCsrfToken(HttpContext, token);
            }

            HttpContext.Response.Headers.CacheControl = "no-store";
            await Send.OkAsync(new CsrfTokenResponse(token!), ct);
        }
    }
}
