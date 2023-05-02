using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tracksplore.DataAccess.Models;

namespace Tracksplore.DataAccess.Services;

public abstract class Service<TEntity> where TEntity : Entity, new()
{
  private readonly Repository<TEntity> repository;

  public Service(Repository<TEntity> repository)
  {
    this.repository = repository;
  }

  public virtual TEntity Create()
  {
    return new()
    {
      Id = Guid.NewGuid(),
      CreationDateTime = DateTime.UtcNow
    };
  }

  public virtual IEnumerable<TEntity> GetAll()
  {
    return this.Query().ToList();
  }

  public virtual TEntity? Get(Guid id)
  {
    return this.Query().SingleOrDefault(x => x.Id == id);
  }

  public virtual void Add(TEntity item)
  {
    this.repository.Add(item);
  }

  public virtual void Update(TEntity item)
  {
    this.repository.Update(item);
  }

  public virtual bool Delete(Guid id)
  {
    return this.repository.Delete(id);
  }

  protected virtual IQueryable<TEntity> Query()
  {
    return this.repository.GetAll();
  }
}
