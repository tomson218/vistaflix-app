using backend.Domain;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Users.GetUser
{

    
    public record GetUserRequest(int Id);

    public record GetUserResponse(int Id, string FirstName, string LastName);
    public class GetUserEndpoint(VistaFlixContext db) : Endpoint<GetUserRequest, GetUserResponse>
    {
        //private readonly VistaFlixContext _db;

        //public GetUserEndpoint(VistaFlixContext db) { _db = db; }



        public override void Configure()
        {
            Get("/{Id}");
            Group<UsersGroup>();
            AllowAnonymous();
        }
        public override async Task HandleAsync(GetUserRequest req, CancellationToken ct)
        {
            //var db = new VistaFlixContext();

            var user = await db.Users.SingleOrDefaultAsync(b => b.Id == req.Id, ct);

            if (user is null)
            {
                await Send.NoContentAsync(ct);
                return;
            }

            await Send.OkAsync(new GetUserResponse(user.Id, user.FirstName, user.LastName), ct);
        }

    }

    
}
