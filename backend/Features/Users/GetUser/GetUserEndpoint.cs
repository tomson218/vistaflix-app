using backend.Domain;
using backend.Services;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Users.GetUser
{
    public record GetUserRequest(int Id);

    public record GetUserResponse(int Id, string FirstName, string LastName, string Email, string PhoneNumber);
    
    public class GetUserEndpoint(VistaFlixContext db) : Endpoint<GetUserRequest, GetUserResponse>
    {
        public override void Configure()
        {
            Get("/{Id}");
            Group<UsersGroup>();
        }

        public override async Task HandleAsync(GetUserRequest req, CancellationToken ct)
        {
            if (!User.CanAccessDataOf(req.Id))
            {
                await Send.ForbiddenAsync(ct);
                return;
            }

            var user = await db.Users.FindAsync(req.Id);

            if (user is null)
            {
                await Send.NotFoundAsync(ct);
                return;           
            }
            await Send.OkAsync(new GetUserResponse(user.Id,  user.FirstName, user.LastName, user.Email, user.PhoneNumber), ct);
        }
    }
}