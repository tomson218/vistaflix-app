using System.Security.Claims;
using backend.Domain.Users;
using FastEndpoints.Security;

namespace backend.Services
{
    public static class CurrentUserExtensions
    {
        public static bool CanAccessDataOf(this ClaimsPrincipal principal, int ownerId) =>
            principal.IsInRole(nameof(UserRole.Admin))
            || principal.ClaimValue(TokenService.UserIdClaim) == ownerId.ToString();
    }
}
