using Tracksplore.DataAccess.Models;

namespace Tracksplore.API.Models;

public class MusicTasteDto
{
  public Guid Id { get; set; }

  public bool IsDisabled { get; set; }

  public ISet<string>? ArtistIds { get; set; }

  public ISet<GenreFeatureDto>? GenreFeatures { get; set; }

  public Guid UserId { get; set; }

  public static MusicTasteDto FromMusicTaste(MusicTaste musicTaste)
  {
    return new MusicTasteDto
    {
      Id = musicTaste.Id,
      IsDisabled = musicTaste.IsDisabled,
      ArtistIds = musicTaste.Artists.Select(a => a.SpotifyId).ToHashSet(),
      GenreFeatures = musicTaste.GenreFeatures.Select(GenreFeatureDto.FromGenreFeature).ToHashSet(),
      UserId = musicTaste.UserId,
    };
  }
}
