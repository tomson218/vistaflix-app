using backend.Domain.Movies;
using backend.Domain.Tickets;

namespace backend.Domain.MovieScreenings
{
    public class MovieScreening
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CinemaHall { get; set; } = string.Empty;
        public DateTime ScreeningDateTime { get; set; }
        public Movie Movie { get; set; } = new Movie();
        public List<Ticket> Tickets { get; set; } = new();
    }
}
