using Microsoft.EntityFrameworkCore;
using Tracksplore.DataAccess.Models;

namespace Tracksplore.DataAccess.Services;

public class MusicTasteService : Service<MusicTaste>
{
  public MusicTasteService(Repository<MusicTaste> repository)
    : base(repository)
  {
  }

  public IEnumerable<MusicTaste> GetAllByUserId(Guid userId)
  {
    return this.Query().Include(mt => mt.GenreFeatures).Include(mt => mt.Artists).Where(mt => mt.UserId == userId).AsEnumerable();
  }
}
