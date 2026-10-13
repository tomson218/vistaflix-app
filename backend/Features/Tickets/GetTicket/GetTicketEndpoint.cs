using backend.Domain;
using FastEndpoints;

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
            var ticket = await db.Tickets.FindAsync(req.Id);

            if (ticket == null)
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            await Send.OkAsync(new GetTicketResponse(ticket.Id, ticket.OrderId, ticket.MovieScreeningId, ticket.Seating), ct);
        }
    }
}
