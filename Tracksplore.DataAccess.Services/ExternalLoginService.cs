using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tracksplore.DataAccess.Models;

namespace Tracksplore.DataAccess.Services;

public class ExternalLoginService : Service<ExternalLogin>
{
  public ExternalLoginService(Repository<ExternalLogin> repository)
    : base(repository)
  {
  }

  public ExternalLogin? GetByProviderNameAndProviderKey(string providerName, string providerKey)
  {
    return this.Query()
      .SingleOrDefault(el => el.ProviderName == providerName && el.ProviderKey == providerKey);
  }
}
