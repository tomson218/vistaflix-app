using backend.Domain.MovieScreenings;

namespace backend.Domain.Movies
{
    public class Movie
    {
        public int Id { get; set; }
        public bool Adult { get; set; }
        public string BackdropPath { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string OriginalLanguage { get; set; } = string.Empty;
        public string OriginalTitle { get; set; } = string.Empty;
        public string Overview { get; set; } = string.Empty;
        public string PosterPath { get; set; } = string.Empty;
        public string MediaType { get; set; } = string.Empty;
        public List<Genre> Genres { get; set; } = new();
        public int Popularity { get; set; }
        public DateTime ReleaseDate { get; set; }
        public bool Video { get; set; }
        public int VoteAverage { get; set; }
        public int VoteCount { get; set; }
        public List<MovieScreening> MovieScreenings { get; set; } = new();
    }

    public enum Genre
    {
        COMEDY,
        ACTION, 
        DRAMA, 
        HORROR
    }
}