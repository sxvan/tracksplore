using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;
using System.Security.Authentication;
using System.Security.Claims;

namespace Tracksplore.API.Extensions;

public static class ControllerBaseExtensions
{
  public static Guid GetCurrentUserId(this ControllerBase controllerBase)
  {
    Claim? claim = controllerBase.User.Claims.SingleOrDefault(c => c.Type == ClaimTypes.Sid);
    if (claim == null)
    {
      throw new AuthenticationException();
    }

    return Guid.Parse(claim.Value);
  } 
}
