using Tracksplore.DataAccess.Models;

namespace Tracksplore.API.Models;

public class UpdateMusicTasteDto
{
  public Guid Id { get; set; }

  public ISet<string> ArtistIds { get; set; }
}
