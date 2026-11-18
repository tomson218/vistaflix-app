using backend.Domain;
using backend.Domain.Users;
using backend.Services;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace backend.Features.Auth.Register
{
    public record RegisterRequest(string FirstName, string LastName, string Email, string Password, string PhoneNumber);

    public class RegisterValidator : Validator<RegisterRequest>
    {
        public RegisterValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(254);
            RuleFor(x => x.Password).NotEmpty().MinimumLength(8).MaximumLength(128);
            RuleFor(x => x.PhoneNumber).NotEmpty().MaximumLength(20);
        }
    }

    public class RegisterEndpoint(VistaFlixContext db, TokenService tokenService, IPasswordHasher<User> passwordHasher)
        : Endpoint<RegisterRequest, AuthUserResponse>
    {
        public override void Configure()
        {
            Post("/register");
            Group<AuthGroup>();
            AllowAnonymous();
        }

        public override async Task HandleAsync(RegisterRequest req, CancellationToken ct)
        {
            var email = req.Email.Trim().ToLowerInvariant();

            if (await db.Users.AnyAsync(u => u.Email == email, ct))
            {
                await SendEmailTakenAsync(ct);
                return;
            }

            var user = new User
            {
                FirstName = req.FirstName.Trim(),
                LastName = req.LastName.Trim(),
                Email = email,
                PhoneNumber = req.PhoneNumber.Trim()
            };
            user.PasswordHash = passwordHasher.HashPassword(user, req.Password);

            db.Users.Add(user);

            try
            {
                await db.SaveChangesAsync(ct);
            }
            catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation })
            {
                await SendEmailTakenAsync(ct);
                return;
            }

            var tokens = tokenService.Issue(user.Id, user.Role);
            AuthCookies.Append(HttpContext, tokens);

            await Send.ResponseAsync(AuthUserResponse.From(user), StatusCodes.Status201Created, ct);
        }

        private Task SendEmailTakenAsync(CancellationToken ct)
        {
            AddError(x => x.Email, "An account with this e-mail address already exists.");
            return Send.ErrorsAsync(StatusCodes.Status409Conflict, ct);
        }
    }
}
