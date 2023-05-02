using Tracksplore.DataAccess.Models;

namespace Tracksplore.API.Models;

public class AddMusicTasteDto
{
  public bool IsDisabled { get; set; }

  public ISet<string> ArtistIds { get; set; }

  public ISet<AddGenreFeatureDto> GenreFeatures { get; set; }
}
