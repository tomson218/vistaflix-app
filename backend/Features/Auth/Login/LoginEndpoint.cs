using backend.Domain;
using backend.Domain.Users;
using backend.Services;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Auth.Login
{
    public record LoginRequest(string Email, string Password);

    public class LoginValidator : Validator<LoginRequest>
    {
        public LoginValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty();
        }
    }

    public class LoginEndpoint(VistaFlixContext db, TokenService tokenService, IPasswordHasher<User> passwordHasher)
        : Endpoint<LoginRequest, AuthUserResponse>
    {
        // Verifying against a dummy hash keeps response times similar for unknown e-mail addresses.
        private static readonly string DummyPasswordHash =
            new PasswordHasher<User>().HashPassword(new User(), Guid.NewGuid().ToString());

        public override void Configure()
        {
            Post("/login");
            Group<AuthGroup>();
            AllowAnonymous();
        }

        public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
        {
            var email = req.Email.Trim().ToLowerInvariant();
            var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email, ct);

            if (!PasswordIsValid(user, req.Password))
            {
                await Send.UnauthorizedAsync(ct);
                return;
            }

            var tokens = tokenService.Issue(user!.Id, user.Role);
            AuthCookies.Append(HttpContext, tokens);

            await Send.OkAsync(AuthUserResponse.From(user), ct);
        }

        private bool PasswordIsValid(User? user, string password)
        {
            try
            {
                var result = passwordHasher.VerifyHashedPassword(user ?? new User(), user?.PasswordHash ?? DummyPasswordHash, password);
                return user is not null && result != PasswordVerificationResult.Failed;
            }
            catch (FormatException)
            {
                // Accounts created before password hashing hold a value that is not a valid hash.
                return false;
            }
        }
    }
}
