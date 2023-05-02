namespace Tracksplore.API.Models;

public class UpdateGenreFeatureDto
{
  public Guid Id { get; set; }

  public string Genre { get; set; }

  public int Percentage { get; set; }
}
