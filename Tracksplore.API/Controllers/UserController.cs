using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tracksplore.API.Extensions;
using Tracksplore.API.Models;
using Tracksplore.Common.Services;
using Tracksplore.DataAccess.Models;
using Tracksplore.DataAccess.Services;

namespace Tracksplore.API.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
  private readonly UserService userService;

  public UserController(UserService userService)
  {
    this.userService = userService;
  }

  [HttpGet]
  public ActionResult<IEnumerable<UserDto>> Get()
  {
    User? user = this.userService.Get(this.GetCurrentUserId());
    if (user == null)
    {
      return NotFound();
    }

    return Ok(UserDto.FromUser(user));
  }

  [AllowAnonymous]
  [HttpPost]
  public ActionResult<UserDto> Add(AddUserDto dto)
  {
    if (this.userService.GetByEmail(dto.Email) != null)
    {
      ModelState.AddModelError(nameof(dto.Email), "There is already an user existing with this username.");
    }

    if (dto.BirthDate > DateTime.UtcNow)
    {
      ModelState.AddModelError(nameof(dto.BirthDate), "Birth year cannot be in the future.");
    }

    if (!ModelState.IsValid)
    {
      return ValidationProblem(ModelState);
    }

    User user = this.userService.Create();
    user.DisplayName = dto.DisplayName;
    user.Email = dto.Email;
    user.PasswordHash = HashService.GetBcrypt(dto.Password);
    user.BirthDate = dto.BirthDate;
    user.Gender = dto.Gender;
    user.SpotifyId = dto.SpotifyId;

    this.userService.Add(user);

    return CreatedAtAction(nameof(this.Add), UserDto.FromUser(user));
  }

  [HttpPut]
  public ActionResult<UserDto> Update(UpdateUserDto dto)
  {
    Guid currentUserId = this.GetCurrentUserId();
    if (dto.Id != currentUserId)
    {
      return Unauthorized();
    }

    User? user = this.userService.GetByDisplayName(dto.DisplayName);
    if (user != null && user.Id != currentUserId)
    {
      ModelState.AddModelError(nameof(dto.DisplayName), "Display name already taken");
    }

    if (!ModelState.IsValid)
    {
      return ValidationProblem(ModelState);
    }

    user ??= this.userService.Get(this.GetCurrentUserId());
    if (user == null)
    {
      return Unauthorized();
    }

    user.DisplayName = dto.DisplayName;
    user.BirthDate = dto.BirthDate;
    user.Gender = dto.Gender;

    this.userService.Update(user);

    return Ok(UserDto.FromUser(user));
  }
}
