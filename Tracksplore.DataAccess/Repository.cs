using Microsoft.EntityFrameworkCore;
using Tracksplore.DataAccess.Contexts;
using Tracksplore.DataAccess.Models;

namespace Tracksplore.DataAccess;

public class Repository<TEntity> where TEntity : Entity, new()
{
  private readonly DatabaseContext context;

  public Repository(DatabaseContext context)
  {
    this.context = context;
  }

  public IQueryable<TEntity> GetAll()
  {
    return this.context.Set<TEntity>().AsNoTracking();
  }

  public void Add(TEntity entity)
  {
    this.context.Set<TEntity>().Add(entity);
    this.context.SaveChanges();
  }

  public void Update(TEntity entity)
  {
    this.context.Set<TEntity>().Update(entity);
    this.context.SaveChanges();
  }

  public bool Delete(Guid id)
  {
    TEntity? entity = this.context.Set<TEntity>().SingleOrDefault(x => x.Id == id);
    if (entity == null)
    {
      return false;
    }

    this.context.Set<Entity>().Remove(entity);
    this.context.SaveChanges();

    return true;
  }
}
