using backend.Domain;
using backend.Domain.Users;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Users.GetAllUsers
{
    public record GetAllUsersResponse(List<GetAllUsersResponse.UserDto> Users)
    {
        public record UserDto(int Id, string FirstName, string LastName, string Email, string PhoneNumber);
    } 

    public class GetAllUsersEndpoint(VistaFlixContext db) : EndpointWithoutRequest<GetAllUsersResponse>
    {
        public override void Configure()
        {
            Get("");  
            Group<UsersGroup>();
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            var usersList = await db.Users
        .Select(u => new GetAllUsersResponse.UserDto(u.Id, u.FirstName, u.LastName, u.Email, u.PhoneNumber))
        .ToListAsync(ct);

            await Send.OkAsync(new GetAllUsersResponse(usersList), ct);
        }
    }
}
