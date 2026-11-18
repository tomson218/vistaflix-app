using backend.Domain;
using backend.Services;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Tickets.GetTicket
{
    public record GetTicketRequest(int Id);

    public record GetTicketResponse(int Id, int OrderId, int MovieScreeningId, string Seating);

    public class GetTicketEndpoint(VistaFlixContext db) : Endpoint<GetTicketRequest, GetTicketResponse>
    {
        public override void Configure()
        {
            Get("/{Id}");
            Group<TicketsGroup>();
        }

        public override async Task HandleAsync(GetTicketRequest req, CancellationToken ct)
        {
            var ticket = await db.Tickets
                .Where(t => t.Id == req.Id)
                .Select(t => new { t.Id, t.OrderId, t.MovieScreeningId, t.Seating, OwnerId = t.Order.UserId })
                .SingleOrDefaultAsync(ct);

            if (ticket == null)
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            if (!User.CanAccessDataOf(ticket.OwnerId))
            {
                await Send.ForbiddenAsync(ct);
                return;
            }

            await Send.OkAsync(new GetTicketResponse(ticket.Id, ticket.OrderId, ticket.MovieScreeningId, ticket.Seating), ct);
        }
    }
}
