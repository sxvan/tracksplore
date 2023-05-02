using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tracksplore.DataAccess.Models;

[Table(nameof(MusicTaste))]
public class MusicTaste : Entity
{
  public bool IsDisabled { get; set; }

  public ISet<Artist>? Artists { get; set; }

  public ISet<GenreFeature>? GenreFeatures { get; set; }

  public Guid UserId { get; set; }

  public User? User { get; set; }
}
