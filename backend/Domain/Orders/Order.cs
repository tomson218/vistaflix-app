using backend.Domain.Tickets;
using backend.Domain.Users;

namespace backend.Domain.Orders
{
    public class Order
    {
        public int Id { get; set; }
        public int TotalAmount { get; set; }
        public User User { get; set; } = new User();
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<Ticket> Tickets { get; set; }
    }
}
