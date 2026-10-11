using FastEndpoints;
using FastEndpoints.Swagger;

namespace backend.Features.Orders
{
    public class OrdersGroup : Group
    {
        public OrdersGroup()
        {
            Configure("/api/v1/orders", ep =>
            {
                ep.Description(x => x
                    .ProducesProblemDetails(500)
                    .AutoTagOverride("Orders")
                    .WithGroupName("Orders"));
                ep.AllowAnonymous();
            });
        }

    }
}
