using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Text;
using Tracksplore.API.Configuration;
using Tracksplore.API.Models;
using Tracksplore.Common.Services;
using Tracksplore.DataAccess.Models;
using Tracksplore.DataAccess.Services;

namespace Tracksplore.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
  private readonly JwtSettings jwtSettings;
  private readonly UserService userService;
  private readonly ExternalLoginService externalLoginService;

  public AuthenticationController(IOptions<JwtSettings> jwtSettings, UserService userService, ExternalLoginService externalLoginService)
  {
    this.jwtSettings = jwtSettings.Value;
    this.userService = userService;
    this.externalLoginService = externalLoginService;
  }

  [HttpPost]
  public IActionResult Authenticate(CredentialsDto dto)
  {
    User? user = this.userService.GetByEmail(dto.Identifier);
    if (user == null)
    {
      ModelState.AddModelError(nameof(dto.Identifier), "There is no user with this email.");
    }
    else if (!HashService.VerifyBcrypt(dto.Password, user.PasswordHash))
    {
      ModelState.AddModelError(nameof(dto.Identifier), "The password is not correct.");
    }

    if (!ModelState.IsValid)
    {
      return ValidationProblem(ModelState);
    }

    string token = JwtTokenService.GenerateToken(
      Encoding.UTF8.GetBytes(jwtSettings.Secret),
      jwtSettings.Issuer,
      jwtSettings.ExpireMinutes,
      jwtSettings.Audience,
      user.DisplayName,
      user.Id.ToString());

    return Ok(new AuthenticateDto { Token = token, User = UserDto.FromUser(user) });
  }

  [HttpPost("External")]
  public IActionResult ExternalAuthenticate(ExternalAuthenticateDto dto)
  {
    if (!ModelState.IsValid)
    {
      return ValidationProblem(ModelState);
    }

    ExternalLogin? externalLogin = this.externalLoginService.GetByProviderNameAndProviderKey(dto.ProviderName, dto.ProviderKey);
    if (externalLogin == null)
    {
      return NotFound();
    }

    User? user = this.userService.Get(externalLogin.UserId);
    if (user == null)
    {
      return NotFound();
    }

    string token = JwtTokenService.GenerateToken(
      Encoding.UTF8.GetBytes(jwtSettings.Secret),
      jwtSettings.Issuer,
      jwtSettings.ExpireMinutes,
      jwtSettings.Audience,
      user.DisplayName,
      user.Id.ToString());

    return Ok(new AuthenticateDto { Token = token });
  }
}
