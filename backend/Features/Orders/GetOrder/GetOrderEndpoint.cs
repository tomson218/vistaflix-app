using backend.Domain;
using backend.Features.Orders;
using FastEndpoints;

namespace backend.Features.Orders.GetOrder
{
    public record GetOrderRequest(int Id);

    public record GetOrderResponse(int Id, int TotalAmount, int UserId, DateTime CreatedAt);
    
    public class GetOrderEndpoint(VistaFlixContext db) : Endpoint<GetOrderRequest, GetOrderResponse>
    {
        public override void Configure()
        {
            Get("/{Id}");
            Group<OrdersGroup>();
        }

        public override async Task HandleAsync(GetOrderRequest req, CancellationToken ct)
        {
           var order = await db.Orders.FindAsync(req.Id);

            if (order == null) 
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            await Send.OkAsync(new GetOrderResponse(order.Id, order.TotalAmount, order.UserId, order.CreatedAt), ct);
        }
    }
}
