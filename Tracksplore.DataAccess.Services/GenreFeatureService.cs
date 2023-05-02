using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tracksplore.DataAccess.Models;

namespace Tracksplore.DataAccess.Services;

public class GenreFeatureService : Service<GenreFeature>
{
  public GenreFeatureService(Repository<GenreFeature> repository)
    : base(repository)
  {
  }
}
