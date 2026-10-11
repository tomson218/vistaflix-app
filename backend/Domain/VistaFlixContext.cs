using backend.Domain.Movies;
using backend.Domain.MovieScreenings;
using backend.Domain.Tickets;
using backend.Domain.Users;
using backend.Domain.Orders;
using Microsoft.EntityFrameworkCore;

namespace backend.Domain
{
    public class VistaFlixContext(DbContextOptions<VistaFlixContext> options) : DbContext(options)
    {
        public DbSet<Movie> Movies { get; set; }
        public DbSet<MovieScreening> MovieScreenings { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
