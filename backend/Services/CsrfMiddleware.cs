namespace backend.Services
{
    public class CsrfMiddleware(RequestDelegate next, CsrfTokenService csrfTokenService)
    {
        public const string HeaderName = "X-CSRF-Token";

        public async Task InvokeAsync(HttpContext context)
        {
            var method = context.Request.Method;
            var isSafeMethod = HttpMethods.IsGet(method) || HttpMethods.IsHead(method)
                || HttpMethods.IsOptions(method) || HttpMethods.IsTrace(method);

            if (!isSafeMethod && !csrfTokenService.Matches(
                    context.Request.Cookies[AuthCookies.CsrfToken],
                    context.Request.Headers[HeaderName].ToString()))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsJsonAsync(new { code = "invalid_csrf_token" });
                return;
            }

            await next(context);
        }
    }
}
