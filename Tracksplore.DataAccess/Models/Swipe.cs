using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Tracksplore.DataAccess.Enums;

namespace Tracksplore.DataAccess.Models;

[Table(nameof(Swipe))]
public class Swipe : Entity
{
  [Required]
  [StringLength(100)]
  public string SpotifyTrackId { get; set; }

  public SwipeResult Result { get; set; }

  public Guid UserId { get; set; }

  public User? User { get; set; }
}
