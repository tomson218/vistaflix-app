using System.Text;
using backend.Domain;
using backend.Domain.Users;
using FastEndpoints.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public record AuthTokens(string AccessToken, DateTime AccessExpiresAt, string RefreshToken, DateTime RefreshExpiresAt);

    public class TokenService(VistaFlixContext db, IConfiguration config)
    {
        public const string UserIdClaim = "UserId";

        private static readonly TimeSpan AccessTokenValidity = TimeSpan.FromMinutes(5);
        private static readonly TimeSpan RefreshTokenValidity = TimeSpan.FromHours(4);

        // A separate key prevents a refresh token from being accepted as an access token.
        private string RefreshSigningKey => config["RefreshTokenSigningKey"]!;

        public AuthTokens Issue(int userId, UserRole role)
        {
            var now = DateTime.UtcNow;
            var accessExpiresAt = now.Add(AccessTokenValidity);
            var refreshExpiresAt = now.Add(RefreshTokenValidity);

            return new AuthTokens(
                CreateToken(userId, config["TokenSigningKey"]!, accessExpiresAt, role.ToString()),
                accessExpiresAt,
                CreateToken(userId, RefreshSigningKey, refreshExpiresAt),
                refreshExpiresAt);
        }

        public async Task<AuthTokens?> RefreshAsync(string? refreshToken, CancellationToken ct)
        {
            if (string.IsNullOrEmpty(refreshToken))
                return null;

            var validation = await new JsonWebTokenHandler().ValidateTokenAsync(refreshToken, new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                RequireExpirationTime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(RefreshSigningKey)),
                ClockSkew = TimeSpan.Zero
            });

            if (!validation.IsValid
                || !validation.Claims.TryGetValue(UserIdClaim, out var userIdClaim)
                || !int.TryParse(userIdClaim?.ToString(), out var userId))
            {
                return null;
            }

            // The role is read from the database so that role changes apply on the next refresh.
            var role = await db.Users
                .Where(u => u.Id == userId)
                .Select(u => (UserRole?)u.Role)
                .SingleOrDefaultAsync(ct);

            return role is null ? null : Issue(userId, role.Value);
        }

        private static string CreateToken(int userId, string signingKey, DateTime expiresAt, string? role = null) =>
            JwtBearer.CreateToken(options =>
            {
                options.SigningKey = signingKey;
                options.ExpireAt = expiresAt;
                options.User[UserIdClaim] = userId.ToString();

                if (role is not null)
                    options.User.Roles.Add(role);
            });
    }
}
