using backend.Domain;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Tickets.GetAllTickets
{
    public record GetAllTicketsResponse(List <GetAllTicketsResponse.TicketDto> Tickets)
    {
        public record TicketDto(int Id, int OrderId, int MovieScreeningId, string Seating);
    }

    public class GetAllTicketsEndpoint(VistaFlixContext db) : EndpointWithoutRequest<GetAllTicketsResponse>
    {
        public override void Configure()
        {
            Get("");
            Group<TicketsGroup>();
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            var ticketsList = await db.Tickets
                 .Select(t => new GetAllTicketsResponse.TicketDto(t.Id, t.OrderId, t.MovieScreeningId, t.Seating))
                 .ToListAsync(ct);

            await Send.OkAsync(new GetAllTicketsResponse(ticketsList), ct);
        }
    }
}
