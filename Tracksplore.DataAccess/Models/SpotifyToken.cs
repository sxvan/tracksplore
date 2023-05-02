using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tracksplore.DataAccess.Models;

[Table(nameof(SpotifyToken))]
public class SpotifyToken : Entity
{
  [Required]
  [StringLength(100)]
  public string AccessToken { get; set; }

  [Required]
  [StringLength(100)]
  public string TokenType { get; set; }

  [Required]
  [StringLength(500)]
  public string Scope { get; set; }

  public int ExpiresIn { get; set; }

  [Required]
  [StringLength(100)]
  public string RefreshToken { get; set; }

  public Guid UserId { get; set; }

  public User? User { get; set; }
}
