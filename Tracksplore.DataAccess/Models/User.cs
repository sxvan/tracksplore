using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tracksplore.DataAccess.Enums;

namespace Tracksplore.DataAccess.Models;

[Table(nameof(User))]
public class User : Entity
{
  [Required]
  [StringLength(50, MinimumLength = 4)]
  public string DisplayName { get; set; }

  [Required]
  [StringLength(300)]
  [EmailAddress]
  public string Email { get; set; }

  public string? PasswordHash { get; set; }

  public DateTime BirthDate { get; set; }

  public Gender Gender { get; set; }

  public string? SpotifyId { get; set; }

  public Guid? SpotifyTokenId { get; set; }

  public SpotifyToken? SpotifyToken { get; set; }

  public ISet<MusicTaste>? MusicTastes { get; set; }

  public ISet<ExternalLogin>? ExternalLogins { get; set; }
}
