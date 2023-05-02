using Tracksplore.DataAccess.Enums;

namespace Tracksplore.API.Models
{
  public class AddSwipeDto
  {
    public string SpotifyTrackId { get; set; }

    public SwipeResult Result { get; set; }
  }
}
