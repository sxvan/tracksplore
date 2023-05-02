namespace Tracksplore.API.Models;

public class AddGenreFeatureDto
{
  public Guid MusicTasteId { get; set; }

  public string Genre { get; set; }

  public double Percentage { get; set; }
}
