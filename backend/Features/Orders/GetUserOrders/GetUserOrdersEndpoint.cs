using backend.Domain;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Orders.GetUserOrders
{
    public record GetUserOrdersRequest(int Id);

    public record GetUserOrdersResponse(List <GetUserOrdersResponse.OrderDto> OrderDtos)
    {
        public record OrderDto(int Id, int TotalAmount, int UserId, DateTime CreatedAt);
    }

    public class GetUserOrdersEndpoint(VistaFlixContext db) : Endpoint<GetUserOrdersRequest, GetUserOrdersResponse>
    {
        public override void Configure()
        {
            Get("/users/{Id}");
            Group<OrdersGroup>();
        }

        public override async Task HandleAsync(GetUserOrdersRequest req, CancellationToken ct)
        {
            var userOrdersList = await db.Orders
            .Where(o => o.UserId == req.Id)
            .Select(o => new GetUserOrdersResponse.OrderDto(o.Id, o.TotalAmount, o.UserId, o.CreatedAt))
            .ToListAsync();
        }   
    }
}