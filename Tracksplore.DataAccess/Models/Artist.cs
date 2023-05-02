using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tracksplore.DataAccess.Models;

[Table(nameof(Artist))]
public class Artist : Entity
{
  public string SpotifyId { get; set; }

  public ISet<MusicTaste>? MusicTastes { get; set; }
}
