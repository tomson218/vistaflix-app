using FastEndpoints;
using FastEndpoints.Swagger;

namespace backend.Features.Tickets
{
    public class TicketsGroup : Group
    {
        public TicketsGroup()
        {
            Configure("/api/v1/tickets", ep =>
            {
                ep.Description(x => x
                    .ProducesProblemDetails(500)
                    .AutoTagOverride("Tickets")
                    .WithGroupName("Tickets"));
                ep.AllowAnonymous();
            });
        }
    }
}
