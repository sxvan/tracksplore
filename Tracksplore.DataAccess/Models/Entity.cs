using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tracksplore.DataAccess.Models;

public abstract class Entity
{
  public  Guid Id { get; set; }

  public DateTime CreationDateTime { get; set; }  
}
