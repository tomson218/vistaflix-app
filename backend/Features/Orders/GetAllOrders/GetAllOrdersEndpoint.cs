using backend.Domain;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Orders.GetAllOrders
{
    public record GetAllOrdersResponse(List <GetAllOrdersResponse.OrderDto> Orders)
    {
        public record OrderDto(int Id, int TotalAmount, int UserId, DateTime CreatedAt);
    }

    public class GetAllOrdersEndpoint(VistaFlixContext db) : EndpointWithoutRequest<GetAllOrdersResponse>
    {
        public override void Configure()
        {
            Get("");
            Group<OrdersGroup>();
        }

        public override async Task HandleAsync(CancellationToken ct)
        {
            var ordersList = await db.Orders
                .Select(o => new GetAllOrdersResponse.OrderDto(o.Id, o.TotalAmount, o.UserId, o.CreatedAt))
                .ToListAsync(ct);

            await Send.OkAsync(new GetAllOrdersResponse(ordersList), ct);
        }
    }
}
