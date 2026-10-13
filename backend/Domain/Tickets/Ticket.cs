using backend.Domain.MovieScreenings;
using backend.Domain.Orders;

namespace backend.Domain.Tickets
{
    public class Ticket
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int MovieScreeningId { get; set; }
        public string Seating { get; set; } = string.Empty;
        public int Amount { get; set; }
        public Order Order { get; set; }
        public MovieScreening MovieScreening { get; set; }
    }
}