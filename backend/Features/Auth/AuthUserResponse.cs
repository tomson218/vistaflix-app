using backend.Domain.Users;

namespace backend.Features.Auth
{
    public record AuthUserResponse(int Id, string FirstName, string LastName, string Email, string PhoneNumber)
    {
        public static AuthUserResponse From(User user) =>
            new(user.Id, user.FirstName, user.LastName, user.Email, user.PhoneNumber);
    }
}
