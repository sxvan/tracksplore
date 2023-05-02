using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Tracksplore.API.Models;
using Tracksplore.DataAccess.Models;
using Tracksplore.DataAccess.Services;

namespace Tracksplore.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ExternalLoginController : ControllerBase
{
  private readonly ExternalLoginService externalLoginService;
  private readonly HttpClient httpClient;

  public ExternalLoginController(ExternalLoginService externalLoginService, HttpClient httpClient)
  {
    this.externalLoginService = externalLoginService;
    this.httpClient = httpClient;
  }

  [HttpPost]
  public IActionResult Add(AddExternalLoginDto dto)
  {
    if (!ModelState.IsValid)
    {
      return ValidationProblem(ModelState);
    }

    ExternalLogin externalLogin = this.externalLoginService.Create();
    externalLogin.UserId = dto.UserId;
    externalLogin.ProviderName = dto.ProviderName;
    externalLogin.ProviderKey= dto.ProviderKey;

    this.externalLoginService.Add(externalLogin);

    return CreatedAtAction(nameof(this.Add), externalLogin);
  }
}
