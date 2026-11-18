namespace backend.Services
{
    public static class AuthCookies
    {
        public const string AccessToken = "access_token";
        public const string RefreshToken = "refresh_token";
        public const string CsrfToken = "csrf_token";

        private const string RootPath = "/";
        private const string RefreshTokenPath = "/api/v1/auth";

        public static void Append(HttpContext context, AuthTokens tokens)
        {
            context.Response.Cookies.Append(AccessToken, tokens.AccessToken, CreateOptions(context, RootPath, tokens.AccessExpiresAt));
            context.Response.Cookies.Append(RefreshToken, tokens.RefreshToken, CreateOptions(context, RefreshTokenPath, tokens.RefreshExpiresAt));
        }

        public static void AppendCsrfToken(HttpContext context, string token) =>
            context.Response.Cookies.Append(CsrfToken, token, CreateOptions(context, RootPath, null));

        public static void Clear(HttpContext context)
        {
            context.Response.Cookies.Delete(AccessToken, CreateOptions(context, RootPath, null));
            context.Response.Cookies.Delete(RefreshToken, CreateOptions(context, RefreshTokenPath, null));
        }

        private static CookieOptions CreateOptions(HttpContext context, string path, DateTime? expires) => new()
        {
            HttpOnly = true,
            // Local development runs over http://localhost; every other environment requires HTTPS.
            Secure = !context.RequestServices.GetRequiredService<IHostEnvironment>().IsDevelopment(),
            SameSite = SameSiteMode.Strict,
            Path = path,
            Expires = expires
        };
    }
}
