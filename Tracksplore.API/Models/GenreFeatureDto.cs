using Tracksplore.DataAccess.Models;

namespace Tracksplore.API.Models
{
  public class GenreFeatureDto
  {
    public Guid Id { get; set; }

    public string Genre { get; set; }

    public double Percentage { get; set; }

    public static GenreFeatureDto FromGenreFeature(GenreFeature genreFeature)
    {
      return new GenreFeatureDto
      {
        Id = genreFeature.Id,
        Genre = genreFeature.Genre,
        Percentage = genreFeature.Percentage
      };
    }
  }
}
